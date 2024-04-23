import * as fs from "fs";
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './books.model';
import { join } from "path";
import * as Epub from "epub";

@Injectable()
export class BooksService {
    constructor(@InjectModel("Book") private readonly bookModel: Model<Book>) {}
        
    getBooks(limit: number, offset: number) {

        return this.bookModel.find().skip(offset).limit(limit);
    }

    async searchBooks(search:string, limit: number, offset: number) {
        const books = await this.bookModel.find({$or: [{title: {$regex: search, $options: 'i'}}, {author: {$regex: search, $options: 'i'}}]})
            .limit(limit)
            .skip(offset);
        return books;
    }

    findBookById(id: string) {
        return this.bookModel.findById(id);
    }

    findBooksByAuthor(author: string) {
        return this.bookModel.find({author});
    }

    findBooksByTitle(title: string) {
        return this.bookModel.find({title});
    }

    async findBookFilePath(id: string) {
        const book = await this.bookModel.findById(id);
        const filePath = book.path;
        return filePath;
    }

    async reMigrateDB() {
        const files = fs.readdirSync(join(__dirname, '..','..', '/uploads/archiv'));
        const lol = files.splice(0, 100);
        lol.forEach((file, i) =>{
            console.log(file);
            const filePath = join(__dirname, '..','..', '/uploads/archiv', file);
            const book = new Epub(filePath);
            const bookDoc:any = {};
            book.on("end", async () => {
                let cover;
                if(!book.metadata.cover || typeof book.metadata.cover !== "string") {
                    cover = "cover"
                }
                else {
                    cover = book.metadata.cover;
                }
                book.getImage(cover, async (err, data, mimeType) => {
                    if(mimeType === "undefined") {
                        bookDoc.cover = "";
                        return;
                    }
                    if(err) {
                        console.log(err);
                        bookDoc.cover = ""
                        return;
                    }
                    const ext = mimeType.split('/')[1];

                    if(!book.metadata.title) {
                        console.log(book.metadata);
                        console.log(file)
                        book.metadata.title = file.replace(".epub", "");
                    }
                    const sanitizedTitle = book.metadata.title.replace(/[^a-zA-Z0-9]/g, '');
                    

                    const picPath = join(__dirname, '..','..', '/uploads/archiv/covers/',  sanitizedTitle + "." + ext);
                    try {
                        fs.writeFileSync(picPath, data);
                        bookDoc.cover = picPath.split('/').slice(-1)[0];
                    } catch (error) {
                        console.log(book.metadata)
                        console.log(error);
                        bookDoc.cover = "";
                        
                    }

                    const bookObj:any = book
                    
                    bookDoc.isbn = bookObj?.metadata.isbn || bookObj?.metadata.ISBN || "unknown";
                    bookDoc.path = filePath.split('/').slice(-1)[0];
                    bookDoc.author = bookObj?.metadata.creator || "unknown";
                    bookDoc.title = bookObj?.metadata.title || file.replace(".epub", "");
                    bookDoc.pubdate = bookObj?.metadata.date || new Date(Date.now()).toDateString();
                    console.log(bookObj?.metadata)
                    console.log(bookDoc)
                    this.bookModel.create(bookDoc);
                    

                });
            console.log(file)
            console.log("finished file " + i + " of " + files.length);
            });
            book.parse();
        });

        return "done";
            
    }
}
