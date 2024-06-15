import * as fs from "fs";
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './books.model';
import { join } from "path";
import * as Epub from "epub";
import { finished } from "stream";
import { BooksValidator } from "./books.validator";

@Injectable()
export class BooksService {
    constructor(@InjectModel("Book") private readonly bookModel: Model<Book>) {}
    
    async updateBook(book: BooksValidator) {
        const existingBook = await this.bookModel.findById(book.id);
        if(!existingBook) {
            throw new BadRequestException("Book not found");
        }
        let newBook:any = book;
        newBook._id = book.id;
        await this.bookModel.updateOne({_id: book.id}, newBook);
        return "Book updated";
    }

    async getBooks(limit: number, offset: number) {
        return await this.bookModel.find().skip(offset).limit(limit);
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

        for await (const file of files) {
            if(file.endsWith(".pdf")){
                continue;
            }
            const filePath = join(__dirname, '..','..', '/uploads/archiv', file);
            const book = new Epub(filePath);
            const bookDoc:any = {};

            await new Promise<void>((resolve, reject) => {
                book.on("end", async () => {
                    console.log("parsing file " + book.metadata.title);

                    const imageKeys = Object.keys(book.manifest).filter(key => 
                        book.manifest[key].mediaType?.startsWith('image/') || 
                        book.manifest[key]['media-type']?.startsWith('image/')
                    );
                    console.log("imageKeys", imageKeys);
                    let cover = imageKeys[0];
                    
                    const metadata = book.metadata;

                    const coverPrmoise = await new Promise<string>((resolve, reject) => {
                        book.getImage(cover, async (err, data, mimeType) => {
                            if(mimeType === "undefined") {
                                console.log("no cover found");
                                cover = "";
                                resolve(cover);
                                return
                            }
                            if(err) {
                                console.log("get Iamge error", err);
                                cover = ""
                                resolve(cover);
                                return;
                            }
          
                            const ext = mimeType.split('/')[1];

                            if(!metadata.title) {
                                metadata.title = file.replace(".epub", "");
                            }

                            const sanitizedTitle = metadata.title.replace(/[^a-zA-Z0-9]/g, '');
                        
                            const picPath = join(__dirname, '..','..', '/uploads/archiv/covers/',  sanitizedTitle + "." + ext);
                            try {
                                console.log("writing file " + picPath)
                                fs.writeFileSync(picPath, data);
                                cover = picPath.split('/').slice(-1)[0];
                                resolve(cover);
                            } catch (error) {
                                console.log("error writing file", error)
                                cover = "";
                                resolve(cover);
                            }
                            console.log(cover)
                        });
                    }); 
                    
                    const bookObj:any = book
                
                    
                    bookDoc.isbn = bookObj?.metadata.isbn || bookObj?.metadata.ISBN || "unknown";
                    bookDoc.path = filePath.split('/').slice(-1)[0];
                    bookDoc.author = bookObj?.metadata.creator || "unknown";
                    bookDoc.title = bookObj?.metadata.title || file.replace(".epub", "");
                    bookDoc.pubdate = bookObj?.metadata.date || new Date(Date.now()).toDateString();
                    bookDoc.cover = coverPrmoise;
                    console.log("bookDoc", bookDoc)
                    try {
                        const existingBook = await this.bookModel.findOne({title: bookDoc.title});
                        if(!existingBook) {
                            console.log("cover", bookDoc.cover)
                            await this.bookModel.create(bookDoc).then(()=>{
                                console.log("finished file " + bookDoc.title + " successfully")
                                resolve();
                            });
                        }
                        else {
                            console.log("book already exists")
                            resolve();
                        }
                            
                    } catch (error) {
                        console.log(error);
                        reject();
                    }
            
                })
                try {
                    book.parse();
                } catch (error) {
                    console.log(error);
                    reject();
                }
            });
        };

        return "done";

    }
}