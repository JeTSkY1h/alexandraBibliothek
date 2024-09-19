import { promises as ps } from 'fs';
import * as fs from "fs";
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './books.model';
import { join } from "path";
import * as Epub from "epub";
import { finished } from "stream";
import { BooksValidator } from "./books.validator";
import { UserBooksService } from "src/user-books/user-books.service";

@Injectable()
export class BooksService {
    constructor(
        @InjectModel("Book") private readonly bookModel: Model<Book>,
        ) {}

    async updateBook(book: BooksValidator) {
        const existingBook = await this.bookModel.findById(book._id);
        if(!existingBook) {
            throw new BadRequestException("Book not found");
        }
        let newBook:any = book;
        newBook._id = book._id;
        await this.bookModel.updateOne({_id: book._id}, newBook);
        return "Book updated";
    }

    async getBooksByIds(ids: string[]) {
        return await this.bookModel.find({_id: {$in: ids}});
    }

    async getBooks(limit: number, offset: number): Promise<Book[]> {
        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);

        //const books = await this.bookModel.find().sort({title: 1, _id: 1}).skip(offsetNumber).limit(limitNumber);
        const books = await this.bookModel.aggregate([
            {
                $facet: {
                    books: [
                        {
                            $sort: {title: 1}
                        },
                        {
                            $skip: offsetNumber
                        },
                        {
                            $limit: limitNumber
                        }
                    ],
                    count: [
                        {
                            $count: "count"
                        }
                    ]
                }
            }
        ])
        return books;
    }

    async searchBooks(search:string, limit: number, offset: number) {
        const books = await this.bookModel.find({$or: [{title: {$regex: search, $options: 'i'}}, {author: {$regex: search, $options: 'i'}}]})
            .sort({title: 1})
            .skip(offset)
            .limit(limit)
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

    private async getSortedBookFiles() {
        const files = await ps.readdir(join(__dirname, '..','..', '/uploads/archiv'));
        //sort files by alphabetical by name
        const filteredFiles = files.filter(file => file.endsWith(".epub"));
        const sortedfiles = filteredFiles.sort((a, b) => a.localeCompare(b));
        return sortedfiles;
    }

    private async filePathExists(filePath: string): Promise<boolean> {
        console.log("checking file", filePath);
        const count = await this.bookModel.countDocuments({ path: filePath });
        console.log("count", count, filePath);
        return count > 0;
    }

    private async titleExists(title: string): Promise<boolean> {
        console.log("checking title", title);
        const count = await this.bookModel.countDocuments({ title });
        return count > 0;
    }

    async reMigrateDB() {
        const sortedFiles = await this.getSortedBookFiles();
        const filteredFiles = await Promise.all(sortedFiles.filter(async (file) => {
            return !await this.filePathExists(file);
        }));
        console.log("filteredFiles", filteredFiles);
        for await (const file of filteredFiles) {
  
            const filePath = join(__dirname, '..','..', '/uploads/archiv', file);

            console.log("parsing file " + file);
            const book = new Epub(filePath);
            const bookDoc:any = {};

            const processBook = new Promise<void>((resolve, reject) => {
                book.on("end", async () => {
                    console.log("opening book " + book.metadata.title);
                    const exists = await this.titleExists(book.metadata.title || file.replace(".epub", ""));
                    if(exists) {
                        console.log("book already exists");
                        resolve();
                        return;
                    }
                    const imageKeys = Object.keys(book.manifest).filter(key => 
                        book.manifest[key].mediaType?.startsWith('image/') || 
                        book.manifest[key]['media-type']?.startsWith('image/')
                    );
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
                                await ps.writeFile(picPath, data);
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
        
                        console.log("cover", bookDoc.cover)
                        try {
                        await this.bookModel.create(bookDoc).then(()=>{
                            console.log("finished file " + bookDoc.title + " successfully")
                            resolve();
                        });}
                        catch (error) {
                            console.log("error writing file", error)
                            resolve();
                        }
                            
                    } catch (error) {
                        console.log(error);
                        resolve();
                    }
            
                })
                book.on("error", (error) => {
                    console.log("error parsing book xD rofl lol", error);
                    reject();
                    return
                });

                try {
                    book.parse();
                } catch (error) {
                    console.log(error);
                    resolve();
                }
            });

            const timeout = new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    console.log("timeout");
                    reject();
                }, 10000);
            });

            await Promise.race([processBook, timeout]).catch((e) => {
                console.log("error processing book", e);
            });


        };

        return "done";

    }
}