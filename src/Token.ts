export class Token {
  static regex: RegExp;
  constructor(public value: string, public start: number, public end: number) {}
}

export class WordToken extends Token {
  // Kun hele ord som ikke indeholder mellemrum eller tal
  static regex = /^[^0-9\s]+$/;

  constructor(public value: string, public start: number, public end: number) {
    if (!value.match(WordToken.regex)) {
      throw new Error(
        `Words must only contain letters. Got: ${value}`
      );
    }

    if (value.trim() !== value) {
      throw new Error(
        `Words must not contain leading or trailing whitespace. Got: ${value}`
      );
    }

    if (value.length === 0) {
      throw new Error(`Words must not be empty. Got: ${value}`);
    }

    super(value, start, end);
  }
}

export class NumberToken extends Token {
  // Alle tal
  static regex = /[0-9]+/g;

  constructor(public value: string, public start: number, public end: number) {
    if (value.match(/[^0-9]/)) {
      throw new Error(
        `Numbers cannot contain letters. Got: ${value}`
      );
    }
    super(value, start, end);
  }
}

export class SymbolToken extends Token {
  // Alle tegn som ikke er bogstaver, mellemrum eller accenter
  static regex = /[^A-zÀ-ú0-9\s]+/;

  constructor(public value: string, public start: number, public end: number) {
    if (!value.match(SymbolToken.regex)) {
      throw new Error(
        `Symbols must only contain non word or number characters. Got: ${value}`
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
