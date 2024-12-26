export interface IUserBookDTO {
    bookId: string;
    userId: string;
    chapter: number;
    lastReadBlock:number;
    rating?: number;
    review?: string;
    startedAt: Date;
    lastOpenedAt: Date;
}