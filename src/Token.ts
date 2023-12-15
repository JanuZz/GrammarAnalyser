export class Token {
  static regex: RegExp;
  constructor(public value: string, public start: number, public end: number) {}
}

export class WordToken extends Token {
  // Alle bogstaver, store og små, samt mellemrum og accenter
  static regex = /[A-zÀ-ú]+/;

  constructor(public value: string, public start: number, public end: number) {
    if (!value.match(WordToken.regex)) {
      throw new Error(
        `WordToken value must only contain word characters. Got: ${value}`
      );
    }

    if (value.trim() !== value) {
      throw new Error(
        `WordToken value must not contain leading or trailing whitespace. Got: ${value}`
      );
    }

    if (value.length === 0) {
      throw new Error(`WordToken value must not be empty. Got: ${value}`);
    }

    super(value, start, end);
  }
}

export class SymbolToken extends Token {
  // Alle tegn som ikke er bogstaver, mellemrum eller accenter
  static regex = /[^A-zÀ-ú]+/;

  constructor(public value: string, public start: number, public end: number) {
    if (!value.match(SymbolToken.regex)) {
      throw new Error(
        `SymbolToken value must only contain non-word characters. Got: ${value}`
      );
    }
    super(value, start, end);
  }
}

export class SentenceStartToken extends Token {
  constructor(public index: number) {
    super("", index, index);
  }
}
