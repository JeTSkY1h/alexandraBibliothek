import { InferSchemaType, Schema } from "mongoose";

export const bookShema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
            minlength: 3,
        },
        cover: {
            type: String,
            required: false
        },
        isbn: {
            type: String,
            required: false,
        },
        path: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        pubdate: {
            type: String,
            required: true,
        },
        series_index: {
            type: Number,
            required: false
        },
        timestamp: {
            type: String,
            required: false,
        },
        author: {
            type: String,
            required: true,
        },

    }
)

export type Book = InferSchemaType<typeof bookShema> & Document