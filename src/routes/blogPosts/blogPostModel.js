import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostModel = new Schema(
  {
    _id: { type: Number },
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      type: {
        value: Number,
        unit: String,
      },
      required: true,
    },
    author: {
      type: {
        name: String,
        avatar: String,
      },
      required: true,
    },
    content: String,
  },
  {
    timestamps: true,
  }
);

export default model("blogPost", blogPostModel);
