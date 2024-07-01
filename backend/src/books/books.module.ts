import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bookShema } from './books.model';
import { UserBooksModule } from 'src/user-books/user-books.module';

@Module({
  imports: [MongooseModule.forFeature([{name: "Book", schema: bookShema}])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})
export class BooksModule {}
