import { Module } from '@nestjs/common';
import { UserBooksController } from './user-books.controller';
import { UserBooksService } from './user-books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userBookShema } from './user-books.model';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [BooksModule, MongooseModule.forFeature([{ name: 'UserBook', schema: userBookShema }])],
  controllers: [UserBooksController],
  providers: [UserBooksService],
})
export class UserBooksModule {}
