import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserBookDTO, UserBook } from './user-books.model';
import { Model } from 'mongoose';
import { userBooksDTO } from './user-books.validator';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class UserBooksService {
    constructor(@InjectModel("UserBook") private readonly userBookModel: Model<UserBook>,
        private readonly booksService:BooksService) {}

    async test() {
        return "lol";
    }


    async openBook(userBooksDTO: userBooksDTO, userId: string) {
        
        const userBook = await this.userBookModel.findOne({bookId: userBooksDTO.bookId, userId: userId});
        const book = await this.booksService.findBookById(userBooksDTO.bookId);

        if(!userBook) {
            console.log(userId)
            const newUserBook = new this.userBookModel({
                bookId: userBooksDTO.bookId,
                startedAt: new Date(Date.now()),
                userId: userId,
                lastOpenedAt: new Date(Date.now()),
                location: "0",
            });
            console.log(newUserBook);
            const createdUserBook = await this.userBookModel.create(newUserBook);
            const lol:any = createdUserBook.toObject();
            lol.path = book.path;
            console.log("returning", lol);
            return lol;            
        }

        let newUserBook:IUserBookDTO = userBook.toObject();
        newUserBook.lastOpenedAt = new Date(Date.now());
        newUserBook.lastOpenedAt = newUserBook.lastOpenedAt;
        const updatedBook = await this.userBookModel.updateOne({bookId: userBooksDTO.bookId, userId: userId}, userBook);
        newUserBook.path = book.path;
        console.log("returning", newUserBook);
        return newUserBook;
    }

    async updateLocation(location:string, userId:string, bookId:string) {
        console.log(location, userId, bookId);
        const userBook = await this.userBookModel.findOne({bookId: bookId, userId: userId});
        userBook.location = location;
        return this.userBookModel.updateOne({bookId: bookId, userId: userId}, userBook);
    }




}
