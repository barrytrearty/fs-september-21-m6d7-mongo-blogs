import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorModel = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
  },
  { timestamps: true }
);

authorModel.static("findAuthors", async function (mongoQuery) {
  const totalAuthors = await this.countDocuments(mongoQuery.criteria);
  const authors = await this.find(
    mongoQuery.criteria,
    mongoQuery.options.fields
  )
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort);
  return { totalAuthors, authors };
});

export default model("authors", authorModel);
