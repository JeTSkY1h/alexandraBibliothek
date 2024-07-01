import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { LimitPipe } from 'src/Pipes/LimitPipe';
import { OffsetPipe } from 'src/Pipes/OffsetPipe';
import { AuthGuard } from 'src/auth/auth.guard';
import { BooksValidator } from './books.validator';
import { Pagination } from 'src/Decorators/Pagination';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    @UseGuards(AuthGuard)
    updateBook(@Body() book: BooksValidator){
        console.log(book);
        return this.booksService.updateBook(book);
    }

    @Get()
    @UseGuards(AuthGuard)
    getBooks(@Query('limit', LimitPipe) limit: number, @Query('offset', OffsetPipe) offset: number){
        return this.booksService.getBooks(limit, offset);
    }

    @Get("path/:id")
    @UseGuards(AuthGuard)
    getBookFilePath(@Param('id') id: string){
        console.log(id);
        return this.booksService.findBookFilePath(id);
    }

    @Get("test")
    getTest(){
        return this.booksService.reMigrateDB();
    }

    @Get(':id')
    getBookById(@Param('id') id: string){
        return this.booksService.findBookById(id);
    }

    @Get('search/:search')
    @UseGuards(AuthGuard)
    searchBooks(@Param('search') search: string, @Pagination() pagination: {limit: number, offset:number} ){
        return this.booksService.searchBooks(search, pagination.limit, pagination.offset);
    }


    
}
