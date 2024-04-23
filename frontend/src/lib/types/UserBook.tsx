export interface IUserBookDTO {
    bookId: string;
    userId: string;
    location: string;
    rating?: number;
    review?: string;
    startedAt: Date;
    lastOpenedAt: Date;
    path?: string;
}