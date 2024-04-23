import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class userBooksDTO {
    @IsString()
    @IsNotEmpty()
    bookId: string;
}