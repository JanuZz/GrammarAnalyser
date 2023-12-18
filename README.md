# Grammar Analyser
- [DK](##DK)
- [EN](##EN)

## DK
Dette projekt er lavet i sammenhæng med et studie orienteret projekt i fagene Dansk A, og Programmering B. Ideen er at programmet kan tage noget tekst fra brugeren og splitte det op i tokens, ligesom en compiler ville gøre det. Så tage de tokens og lave syntax analyse og tjekke at de overholder de opsatte regler.

De tokens der findes i programmer er som følgene:
- WordToken, består af en gruppe bogstaver
- NumberToken, som består af en gruppe tal
- SymbolToken, et enkelt symbol (,.?! osv.)
- SentenceStartToken, bestemmer hvornår en ny sætning starter.

Tokense kan findes [her](./src/Tokens.ts).
De tokens bliver så brugt til at tjekke syntax som nævnt tidligere. Til sidst printer den så alle de syntax fejl der er fundet

## EN
This project was made in connection with a study-oriented project in the subjects Danish A and Programming B. The idea is that the program can take some text from the user and split it up into tokens, just as a compiler would do it. Then take the tokens and do syntax analysis and check that they comply with the set rules.

The tokens found in programs are as follows:
- WordToken, consists of a group of letters
- NumberToken, which consists of a group of numbers
- SymbolToken, a single symbol (,.?! etc.)
- SentenceStartToken, determines when a new sentence starts.

Tokens can be found [here](./src/Tokens.ts).
The tokens are then used to check syntax as mentioned earlier. Finally, it prints all the syntax errors found
