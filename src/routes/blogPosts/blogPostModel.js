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
    authors: [{ type: Schema.Types.ObjectId, ref: "authors" }],
    content: String,
    comments: [commentModel],
  },
  {
    timestamps: true,
  }
);

blogPostModel.static("findBlogPostWithAuthors", async function (mongoQuery) {
  const totalPosts = await this.countDocuments(mongoQuery.criteria);
  const blogPosts = await this.find(
    mongoQuery.criteria,
    mongoQuery.options.fields
  )
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({ path: "authors" });
  return { totalPosts, blogPosts };
});

export default model("blogPost", blogPostModel);
