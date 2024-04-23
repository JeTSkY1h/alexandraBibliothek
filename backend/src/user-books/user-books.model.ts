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
        location: {
        type: String,
        required: true,
        },
        rating: {
        type: Number,
        },
        review: {
            type: String,
            maxlength: 1500,
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
    location: string;
    rating?: number;
    review?: string;
    startedAt: Date;
    lastOpenedAt: Date;
    path?: string;
}

export type UserBook = InferSchemaType<typeof userBookShema> & Document;