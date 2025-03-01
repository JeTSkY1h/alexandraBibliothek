import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {userBooksDTO} from "./user-books.validator";
import { UserBooksService } from './user-books.service';
import { JwToken } from 'src/Decorators/JwToken';
import { GetUserPipe } from 'src/Pipes/GetUserPipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { Pagination } from 'src/Decorators/Pagination';

@Controller('user-books')
export class UserBooksController {
    constructor(private readonly userBooksService:UserBooksService) {}

    @Post()
    async openBook(@JwToken(GetUserPipe) userId:string, @Body() userBooksDTO: userBooksDTO) {
        return this.userBooksService.openBook(userBooksDTO, userId);
    }

    @Post("location")
    async updateLocation(@JwToken(GetUserPipe) userId:string, @Body() {location, bookId}: {location:string, bookId:string}) {
        return this.userBooksService.updateLocation(location, userId, bookId);
    }

    @Get("last-read")
    async getLastReadBooks(@JwToken(GetUserPipe) userId:string, @Pagination() pagination: {limit:number, offset:number}) {
        return this.userBooksService.getLastReadBooks(userId, pagination.limit, pagination.offset);
    }

    @Post("rating")
    async updateRating(@JwToken(GetUserPipe) userId:string, @Body() {rating, bookId}: {rating:number, bookId:string}) {
        return this.userBooksService.updateRating(rating, userId, bookId);
    }

    @Get("rating")
    async getRating(@JwToken(GetUserPipe) userId:string, @Query() {bookId}: {bookId:string}) {
        return this.userBooksService.getBookData(bookId);
    }

}
