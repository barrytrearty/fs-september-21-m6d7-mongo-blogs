import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentModel = new Schema(
  {
    comments: {
      text: { type: String, required: true },
      username: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export default model("comment", commentModel);
