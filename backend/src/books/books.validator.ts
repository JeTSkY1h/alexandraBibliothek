import { IsNotEmpty, IsString } from "class-validator"

export class BooksValidator {

    @IsString()
    @IsNotEmpty()
    id:string;
    
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    cover:string;

    @IsString()
    isbn:string;

    @IsString()
    @IsNotEmpty()
    path:string;

    @IsString()
    pubdate:string;

    @IsString()
    @IsNotEmpty()
    author:string


}