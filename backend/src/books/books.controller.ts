import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { LimitPipe } from 'src/Pipes/LimitPipe';
import { OffsetPipe } from 'src/Pipes/OffsetPipe';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    @UseGuards(AuthGuard)
    getBooks(@Query('limit', LimitPipe) limit: number, @Query('offset', OffsetPipe) offset: number){
        return this.booksService.getBooks(limit, offset);
    }

    @Get("path/:id")
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
    searchBooks(@Param('search') search: string, @Query('limit', LimitPipe) limit: number, @Query('offset', OffsetPipe) offset: number ){
        return this.booksService.searchBooks(search, limit, offset);
    }

    
}
