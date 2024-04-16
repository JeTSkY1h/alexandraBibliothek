import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { bookShema } from './books.model';

@Module({
  imports: [MongooseModule.forFeature([{name: "Book", schema: bookShema}])],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
