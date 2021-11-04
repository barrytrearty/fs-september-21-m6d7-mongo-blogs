import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const authorModel = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

authorModel.pre("save", async function (next) {
  const newAuthor = this;
  const initialPw = this.password;

  if (newAuthor.isModified("password")) {
    newAuthor.password = await bcrypt.hash(initialPw, 10);
  }

  next();
});

authorModel.methods.toJSON = function () {
  const authorDocument = this;
  const authorObject = authorDocument.toObject();
  delete authorObject.password;
  delete authorObject.__v;

  return authorObject;
};

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

authorModel.statics.checkCredentials = async function (email, password) {
  const author = await this.findOne({ email });

  console.log(author);
  if (author) {
    const isMatch = await bcrypt.compare(password, author.password);
    if (isMatch) return author;
    else return null;
  } else return null;
};

export default model("authors", authorModel);
