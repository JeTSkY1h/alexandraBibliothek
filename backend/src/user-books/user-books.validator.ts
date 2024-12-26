import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class userBooksDTO {
    @IsString()
    @IsNotEmpty()
    bookId: string;
}

export class UserBooksLocationDTO {
    @IsNumber()
    @IsNotEmpty()
    chapter: number;

    @IsNumber()
    @IsNotEmpty()
    lastReadBlock: number;

    @IsString()
    @IsNotEmpty()
    bookId: string;
}