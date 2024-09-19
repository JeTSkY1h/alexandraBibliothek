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

    async getLastReadBooks(userId: string, limit:number, offset:number) {
        const userBooks = await this.userBookModel.find({userId: userId}).sort({lastOpenedAt: "desc"}).skip(offset).limit(limit);
        console.log(userBooks);
        const books = await this.booksService.getBooksByIds(userBooks.map((userBook) => userBook.bookId));
        const sortedBooks: Array<any> = books.map((book: any) => {
            book.lastReadAt = userBooks.find((userBook) => userBook.bookId === String(book._id))?.lastOpenedAt;
            return book;
        }).sort((a, b) => (a.lastReadAt > b.lastReadAt ? -1 : 1));
        return sortedBooks
    }

    async getUserBooks(userId: string, limit:number, offset:number) {
        return this.userBookModel.find({userId: userId}).sort({lastOpenedAT: "desc"}).skip(offset).limit(limit);
    }

    async getUserBook(userId: string, bookId: string) {
        return this.userBookModel.findOne({userId: userId, bookId: bookId});
    }

    async openBook(userBooksDTO: userBooksDTO, userId: string) {
        console.log("Opening book", userBooksDTO, userId);
        const userBook = await this.userBookModel.findOne({bookId: userBooksDTO.bookId, userId: userId});
        const book = await this.booksService.findBookById(userBooksDTO.bookId);

        if(!userBook) {
            const newUserBook = new this.userBookModel({
                bookId: userBooksDTO.bookId,
                startedAt: new Date(Date.now()),
                userId: userId,
                lastOpenedAt: new Date(Date.now()),
                location: "0",
            });
            const createdUserBook = await this.userBookModel.create(newUserBook);
            const lol:any = createdUserBook.toObject();
            lol.path = book.path;
            console.log("Creating NEW USER BOOK");
            console.log("returning new userBook");
            return lol;            
        }

        let newUserBook:IUserBookDTO = userBook.toObject();
        newUserBook.lastOpenedAt = new Date(Date.now());
        const updatedBook = await this.userBookModel.updateOne({bookId: userBooksDTO.bookId, userId: userId}, userBook);
        newUserBook.path = book.path;
        console.log("returning old userBook");
        return newUserBook;
    }

    async updateLocation(location:string, userId:string, bookId:string) {
        console.log(location, userId, bookId);
        const userBook = await this.userBookModel.findOne({bookId: bookId, userId: userId});
        userBook.location = location;
        return this.userBookModel.updateOne({bookId: bookId, userId: userId}, userBook);
    }

    async updateRating(rating:number, userId:string, bookId:string) {
        const userBook = await this.userBookModel.findOne({bookId: bookId, userId: userId});
        userBook.rating = rating;
        return this.userBookModel.updateOne({bookId: bookId, userId: userId}, userBook);
    }

    async getBookData(bookId: string) {
        console.log("Getting book data for bookId: ", bookId);
        const userBooks = await this.userBookModel.find({bookId: bookId});
        console.log(userBooks);
        const ratings = userBooks.map((userBook) => userBook.rating).filter((rating) => rating !== undefined);
        const sum = ratings.reduce((a, b) => a + b, 0);
        const avg = sum / ratings.length;
        return {
            ratings: ratings,
            avgRating: avg,
            userCount: ratings.length,
        }
    }

    async getMostReadBooks(limit:number, offset:number) {
        const userBooks = await this.userBookModel.aggregate([
            {
                $group: {
                    _id: "$bookId",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {count: -1}
            },
            {
                $skip: offset
            },
            {
                $limit: limit
            }
        ]);
        const books = await this.booksService.getBooksByIds(userBooks.map((userBook) => userBook._id));
        return books;
    }
    

}
