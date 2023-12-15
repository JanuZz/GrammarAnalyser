export enum SyntaxErrorType {
    MissingCapitalLettter,
    InvalidSentenceStart,
    InvalidSentenceEnd,
}

export type SyntaxError = {
    type: SyntaxErrorType;
    message: string;
    start: number;
    end: number;
}