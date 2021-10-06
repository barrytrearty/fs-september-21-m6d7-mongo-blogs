import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentModel = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const blogPostModel = new Schema(
  {
    // _id: { type: Number },
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
      name: String,
      avatar: String,
    },
    content: String,
    comments: [commentModel],
  },
  {
    timestamps: true,
  }
);

export default model("blogPost", blogPostModel);
