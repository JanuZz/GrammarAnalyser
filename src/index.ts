let running = true;
import { Token, SymbolToken, WordToken, SentenceStartToken } from "./Token";
import { SyntaxError, SyntaxErrorType } from "./SyntaxError";
import { ask, displayError, say } from "./ux";

function tokenizer(input: string): Token[] {
  const tokens: Token[] = [new SentenceStartToken(0)];

  let current_index = 0;
  let current_value = "";

  const append_current = () => {
    if (current_value !== "") {
      tokens.push(
        new WordToken(
          current_value,
          current_index - current_value.length,
          current_index
        )
      );
      current_value = "";
    }
  };

  // Loop igenneom alle tegn i input strengen.
  while (current_index < input.length) {
    const current_char = input[current_index];
    try {
      // Hvis tegnet er et mellemrum, så tilføj det nuværende ord til tokens, og nulstil current_value
      if (current_char.match(/\s/)) {
        append_current();
      } else if (current_char.match(SymbolToken.regex)) {
        // Hvis tegnet er et symbol, så tilføj det nuværende ord til tokens, og derefter tilføj symbolet til tokens
        append_current();

        tokens.push(
          new SymbolToken(current_char, current_index, current_index + 1)
        );

        if ([".", "?", "!"].includes(current_char)) {
          tokens.push(new SentenceStartToken(current_index));
        }
      } else {
        // Hvis tegnet er et bogstav, så tilføj det til current_value
        current_value += current_char;
      }

      current_index++;
    } catch (error) {
      const error_message = `Error at index ${current_index}: ${
        (error as Error).message
      }`;
      say(error_message.red);

      // Viser hvor fejlen er sket
      say(input);
      say(" ".repeat(current_index - 1) + "^".red);

      // Hvis der er sket en fejl, så stop loopet
      return [];
    }
  }

  if (current_value !== "") {
    tokens.push(
      new WordToken(
        current_value,
        current_index - current_value.length,
        current_index
      )
    );
  }

  return tokens;
}

function syntax_checker(tokens: Token[]): SyntaxError[] {
  const errors: SyntaxError[] = [];

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const next_token = tokens.length > index + 1 ? tokens[index + 1] : null;

    if (token instanceof SentenceStartToken) {
      if (next_token instanceof WordToken) {
        if (!next_token.value[0].match(/[A-ZÀ-ú]/)) {
          errors.push({
            type: SyntaxErrorType.MissingCapitalLettter,
            message: "The first letter of a sentence must be capital.",
            start: next_token.start,
            end: next_token.end,
          });
        }
      }

      if (
        next_token instanceof SymbolToken ||
        next_token instanceof SentenceStartToken
      ) {
        errors.push({
          type: SyntaxErrorType.InvalidSentenceStart,
          message: "A sentence cannot start on a symbol.",
          start: next_token.start,
          end: next_token.end,
        });
      }
    }
  }

  const end_token = tokens[tokens.length - 1];
  if (!(end_token instanceof SentenceStartToken)) {
    errors.push({
      type: SyntaxErrorType.InvalidSentenceEnd,
      message: "A sentence cannot end on a word.",
      start: end_token.start,
      end: end_token.end,
    });
  }

  return errors;
}

(async () => {
  while (running) {
    const input = await ask("What do you want to check?");
    const tokens = tokenizer(input);
    // console.log(tokens);

    const errors = syntax_checker(tokens);
    if (!errors.length) {
        say("No errors found!".green);
    } else {

        say(`${errors.length} Errors found!\n`.red);

        errors.forEach((error) => {
            displayError(input, error);
        });
    }
  }
})();
