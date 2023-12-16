export enum SemanticErrorType {
    MissingCapitalLetter,
    InvalidCapitalLetter,
    InvalidSentenceStart,
    InvalidSentenceEnd,
}

export type SemanticError = {
    type: SemanticErrorType;
    message: string;
    start: number;
    end: number;
}