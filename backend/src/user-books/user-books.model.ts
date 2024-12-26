import { max } from "class-validator";
import { InferSchemaType, Schema } from "mongoose";

export const userBookShema = new Schema(
    {
        bookId: {
        type: String,
        required: true,
        },
        userId: {
        type: String,
        required: true,
        },
        chapter: {
        type: Number,
        required: true,
        },
        lastReadBlock: {
        type: Number,
        required: true,
        },
        rating: {
        type: Number,
        }, 
        startedAt: {
            required: true,
            type: Date,
        },
        lastOpenedAt: {
            required: true,
            type: Date,
        },
        status: {
            type: String,
            enum: ["reading", "completed", "paused", "dropped"],
            default: "reading",
        },
    },

    { timestamps: true },

);

export interface IUserBookDTO {
    bookId: string;
    userId: string;
    chapter: string;
    lastReadBlock:string;
    rating?: number;
    review?: string;
    startedAt: Date;
    lastOpenedAt: Date;
    path?: string;
}

export type UserBook = InferSchemaType<typeof userBookShema> & Document;