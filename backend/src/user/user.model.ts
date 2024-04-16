import { InferSchemaType, Schema } from "mongoose";

export const userShema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    roles: {
      type: Array<string>,
      required: true
    },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userShema> & Document