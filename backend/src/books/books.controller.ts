import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksValidator } from './books.validator';
import { Pagination } from 'src/Decorators/Pagination';
import { AuthGuardHeader } from 'src/auth/auth.guard.header';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    @UseGuards(AuthGuardHeader)
    updateBook(@Body() book: BooksValidator){
        console.log(book);
        return this.booksService.updateBook(book);
    }

    @Get("read/:id/:chapter")
    //@UseGuards(AuthGuardHeader)
    async readBook(@Param('id') id: string, @Param('chapter') chapter: string){
        return this.booksService.getChapter(id, chapter);
    }

    @Get()
    @UseGuards(AuthGuardHeader)
    getBooks(@Pagination() pagination: {limit: number, offset:number}){
        return this.booksService.getBooks(pagination.limit, pagination.offset);
    }

    @Get("path/:id")
    @UseGuards(AuthGuardHeader)
    getBookFilePath(@Param('id') id: string){
        console.log(id);
        return this.booksService.findBookFilePath(id);
    }

    @Get(':id')
    getBookById(@Param('id') id: string){
        return this.booksService.findBookById(id);
    }

    @Get('search/:search')
    @UseGuards(AuthGuardHeader)
    searchBooks(@Param('search') search: string, @Pagination() pagination: {limit: number, offset:number} ){
        return this.booksService.searchBooks(search, pagination.limit, pagination.offset);
    }


    
}
