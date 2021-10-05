import express from "express";
import createHttpError from "http-errors";
import blogPostModel from "./blogPostModel.js";

const blogPostRoute = express.Router();

blogPostRoute.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new blogPostModel(req.body);
    const { _id } = await newBlogPost.save(); // this is where the interaction with the db/collection happens

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogPostRoute.get("/", async (req, res, next) => {
  try {
    const blogPosts = await blogPostModel.find();

    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostRoute.get("/:_id", async (req, res, next) => {
  try {
    const id = req.params._id;

    const blogPost = await blogPostModel.findById(id); // similar to findOne, but findOne expects to receive a query as parameter

    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.put("/:_id", async (req, res, next) => {
  try {
    const id = req.params._id;
    const modifiedUser = await blogPostModel.findByIdAndUpdate(id, req.body, {
      new: true, // returns the modified user
    });

    if (modifiedUser) {
      res.send(modifiedUser);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.delete("/:_id", async (req, res, next) => {
  try {
    const id = req.params._id;

    const deletedUser = await blogPostModel.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostRoute;
