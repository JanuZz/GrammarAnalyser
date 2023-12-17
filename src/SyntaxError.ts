export enum SyntaxErrorType {
    MissingCapitalLetter,
    InvalidCapitalLetter,
    InvalidSentenceStart,
    InvalidSentenceEnd,
}

export type SyntaxError = {
    type: SyntaxErrorType;
    message: string;
    start: number;
    end: number;
}