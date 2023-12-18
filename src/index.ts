import {
  Token,
  SymbolToken,
  WordToken,
  SentenceStartToken,
  NumberToken,
} from "./Token";
import { SyntaxError, SyntaxErrorType } from "./SyntaxError";
import { ask, displayError, say } from "./ux";

/**
 * Tokenizer funktionen tager en sætning som input, og deler den op i tokens. Det gør den ved hjælp af regular expressions.
 * En token består af et ord, et symbol, eller et sætningsstart tegn. Disse tokens bliver brugt til at finde syntax fejl.
 * Tokenizeren er en state machine, som er bygget op på samme måde man ville gøre hvis det var en tokenizer til en compiler.
 *
 * @param input Input består af en sætning, som skal deles op i tokens.
 * @returns En liste af tokens
 */
function tokenizer(input: string): Token[] {
  const tokens: Token[] = [new SentenceStartToken(0)];

  // Holder styr på hvilket index vi er nået til i input strengen
  let current_index = 0;

  // Holder styr på det nuværende ord, som bliver tilføjet til tokens når der kommer et mellemrum eller et symbol
  let current_value = "";

  // Hjælpe funktion til at tilføje det nuværende ord til tokens og nulstille current_value
  const append_current = () => {
    if (current_value !== "") {
      // Check om ordet er et ord eller et tal
      if (current_value.match(WordToken.regex)) {
        tokens.push(
          new WordToken(
            current_value,
            current_index - current_value.length,
            current_index
          )
        );
      } else {
        tokens.push(
          new NumberToken(
            current_value,
            current_index - current_value.length,
            current_index
          )
        );
      }
      current_value = "";
    }
  };

  // Loop igenneom alle tegn i input strengen.
  try {
    while (current_index < input.length) {
      // Hent det nuværende tegn
      const current_char = input[current_index];
      // Hvis tegnet er et mellemrum, så tilføj det nuværende ord til tokens, og nulstil current_value
      if (current_char.match(/\s/)) {
        append_current();
      } else if (current_char.match(SymbolToken.regex)) {
        // Hvis tegnet er et symbol, så tilføj det nuværende ord til tokens, og derefter tilføj symbolet til tokens
        append_current();

        tokens.push(
          new SymbolToken(current_char, current_index, current_index + 1)
        );

        // Hvis det er et tegn som definere slutningen på en sætning, så tilføj et sætningsstart tegn til tokens for at vise at det er en ny sætning
        if ([".", "?", "!"].includes(current_char)) {
          // Tjek om der er et mellemrum efter symbolet, og hvis der er så tilføj et sætningsstart tegn ellers er der en syntax fejl
          if (input[current_index + 1]?.match(/\s/)) {
            tokens.push(new SentenceStartToken(current_index + 1));
          } else {
            // Det er slutningen på input strengen, så der er ikke noget mellemrum efter symbolet
            if (input[current_index + 1] === undefined) break;

            // Tag en del af input strengen som viser hvor fejlen er
            const slice = input.slice(current_index - 8, current_index + 10);
            throw new Error(
              `Expected a space after the symbol '${current_char}'. Got: '${slice}'`
            )
          }
        }
      } else {
        // Hvis tegnet er et bogstav, så tilføj det til current_value
        current_value += current_char;
      }

      // Gå videre til næste tegn
      current_index++;
    }

    // Tilføj det sidste ord til tokens hvis det ikke er tomt
    if (current_value !== "") append_current();
    
  } catch (error) {
    say("SYNTAX ERROR: ".red + (error as Error).message.red);
    return [];
  }
  // Returner tokens
  return tokens;
}

/**
 * Syntax checker funktionen tager en liste af tokens som input, og finder syntax fejl i dem.
 * Det gør den ved hjælp af en række regler som definerer hvad der er tilladt i en sætning.
 * Hvis der er en fejl, så bliver den tilføjet til en liste af fejl, som bliver returneret så brugeren kan se dem senere.
 *
 * @param tokens Token listen som kommer fra tokenizer funktionen
 * @returns
 */
function syntax_checker(tokens: Token[]): SyntaxError[] {
  const errors: SyntaxError[] = [];

  // Loop igennem alle tokens
  for (let index = 0; index < tokens.length; index++) {
    // Hent det nuværende token, og det næste token i listen hvis der er et
    const token = tokens[index];
    const next_token = tokens.length > index + 1 ? tokens[index + 1] : null;

    if (token instanceof WordToken) {
      if (next_token instanceof WordToken) {
        // Tjek om ord i midten af en sætning har store bogstaver
        if (next_token.value.toLowerCase() !== next_token.value) {
          errors.push({
            type: SyntaxErrorType.InvalidCapitalLetter,
            message:
              "A word in the middle of a sentence cannot contain with a capital letter.",
            start: next_token.start,
            end: next_token.end,
          });
        }
      }
    }

    if (token instanceof SentenceStartToken) {
      // Sætningen starter altid med et stort bogstav
      if (next_token instanceof WordToken) {
        if (!next_token.value[0].match(/[A-ZÀ-ú]/)) {
          errors.push({
            type: SyntaxErrorType.MissingCapitalLetter,
            message: "The first letter of a sentence must be capital.",
            start: next_token.start,
            end: next_token.end,
          });
        }
      }

      // Sætningen må ikke starte med et symbol, eller et andet sætningsstart tegn. Det er kun tilladt at starte med et ord
      if (
        next_token instanceof SymbolToken ||
        next_token instanceof SentenceStartToken ||
        next_token instanceof NumberToken
      ) {
        console.log(token);
        console.log(next_token);
        errors.push({
          type: SyntaxErrorType.InvalidSentenceStart,
          message: "A sentence cannot start on a symbol or number.",
          start: next_token.start,
          end: next_token.end,
        });
      }
    }
  }

  // Find den sidste token i inputtet, og tjek om det er en SentenceStartToken for at se om sætningen er slut
  const last_token = tokens[tokens.length - 1];
  if (!(last_token instanceof SymbolToken)) {
    errors.push({
      type: SyntaxErrorType.InvalidSentenceEnd,
      message: "A sentence cannot end on a non-symbol. (Missing ., ! or ?)",
      start: last_token.end,
      end: last_token.end + 1,
    });
  }

  return errors;
}

// Start en async blok for at man kan bruge 'await' til at afvænte svar på et Promise
(async () => {
  // Hold styr på hvorår programmet skal afslutte
  let running = true;
  // Bliv ved med at tjekke sætninger indtil brugeren skriver "exit"
  while (running) {
    // Få input fra brugeren
    const input = await ask("What do you want to check?");

    // Hvis brugeren skriver "exit", så stop programmet
    if (input === "exit") {
      running = false;
      break;
    }

    // Tokenize input
    const tokens = tokenizer(input);

    // Hvis ingen tokens er fundet betyder det at der var en syntax fejl;
    if (tokens.length <= 0) continue;

    // Find grammatik fejl
    const errors = syntax_checker(tokens);

    // Hvis der ikke er nogen fejl, så skriv det til brugeren, ellers vis fejlene
    if (!errors.length) {
      say("No errors found!".green);
    } else {
      say(`${errors.length} Error(s) found!\n`.red);

      // Vis hver enkelt fejl, og tegn en streg under den
      errors.forEach((error) => {
        displayError(input, error);
      });
    }
  }
})();
