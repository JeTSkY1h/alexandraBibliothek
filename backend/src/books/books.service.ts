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
    
        for (const file of sortedFiles) {
            const exists = await this.filePathExists(file);
            if (exists) {
                console.log("Book already exists");
                continue;
            }
            const filePath = join(__dirname, '..', '..', '/uploads/archiv', file);
            console.log("Processing file: " + file);console.log("filteredFiles", sortedFiles);
    
            try {
                await this.processEpubFile(filePath, file);
            } catch (error) {
                console.error(`Failed to process file ${file}:`, error);
                continue// Continue to the next file
            }
        }
    
        return "Migration completed";
    }
    
    private async processEpubFile(filePath: string, file: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            let book: any;
            try {
                book = new Epub(filePath);
            } catch (error) {
                console.error(`Error initializing Epub for ${file}:`, error);
                resolve();
                return;
            }
    
            const bookDoc: any = {};
    
            const timeoutId = setTimeout(() => {
                console.log(`Timeout processing ${file}. Moving to next file.`);
                resolve();
            }, 30000); // 30 seconds timeout
    
            book.on("end", async () => {
                clearTimeout(timeoutId);
                try {
                    console.log("Opening book: " + (book.metadata?.title || file));
                    const exists = await this.titleExists(book.metadata?.title || file.replace(".epub", ""));
                    if (exists) {
                        console.log("Book already exists");
                        resolve();
                        return;
                    }
    
                    // Process book metadata and cover
                    await this.processBookMetadata(book, bookDoc, file);
    
                    await this.bookModel.create(bookDoc);
                    console.log(`Finished processing ${bookDoc.title} successfully`);
                } catch (error) {
                    console.error(`Error processing ${file}:`, error);
                } finally {
                    resolve();
                }
            });
    
            book.on("error", (error) => {
                clearTimeout(timeoutId);
                console.error(`Error parsing book ${file}:`, error);
                resolve();
            });
    
            try {
                book.parse();
            } catch (error) {
                clearTimeout(timeoutId);
                console.error(`Error parsing book ${file}:`, error);
                resolve();
            }
        });
    }
    
    private async processBookMetadata(book: any, bookDoc: any, file: string) {
        const metadata = book.metadata || {};
        let cover = "";
    
        try {
            const imageKeys = Object.keys(book.manifest || {}).filter(key => 
                book.manifest[key]?.mediaType?.startsWith('image/') || 
                book.manifest[key]?.['media-type']?.startsWith('image/')
            );
            
            if (imageKeys.length > 0) {
                cover = await this.processCover(book, imageKeys[0], metadata, file);
            }
        } catch (error) {
            console.error(`Error processing cover for ${file}:`, error);
        }
    
        bookDoc.isbn = metadata?.isbn || metadata?.ISBN || "unknown";
        bookDoc.path = file;
        bookDoc.author = metadata?.creator || "unknown";
        bookDoc.title = metadata?.title || file.replace(".epub", "");
        bookDoc.pubdate = metadata?.date || new Date().toDateString();
        bookDoc.cover = cover;
    
        console.log("bookDoc", bookDoc);
    }
    
    private async processCover(book: any, coverKey: string, metadata: any, file: string): Promise<string> {
        return new Promise<string>((resolve) => {
            book.getImage(coverKey, async (err, data, mimeType) => {
                if (err || mimeType === "undefined") {
                    console.log(`No cover found or error getting cover for ${file}`);
                    resolve("");
                    return;
                }
    
                const ext = mimeType.split('/')[1];
                const sanitizedTitle = (metadata?.title || file.replace(".epub", "")).replace(/[^a-zA-Z0-9]/g, '');
                const picPath = join(__dirname, '..', '..', '/uploads/archiv/covers/', sanitizedTitle + "." + ext);
    
                try {
                    console.log("Writing cover file: " + picPath);
                    await ps.writeFile(picPath, data);
                    resolve(picPath.split('/').slice(-1)[0]);
                } catch (error) {
                    console.error(`Error writing cover file for ${file}:`, error);
                    resolve("");
                }
            });
        });
    }
}