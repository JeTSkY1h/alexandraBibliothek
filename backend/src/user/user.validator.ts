import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";


export class userDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(3)   
    password: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    firstName: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    lastName: string;

    @IsString()
    @IsOptional()
    street: string;

    @IsString()
    @IsOptional()
    houseNumber: number;

    @IsString()
    @IsOptional()
    zipCode: number;

    @IsString()
    @IsOptional()
    city: string;


}