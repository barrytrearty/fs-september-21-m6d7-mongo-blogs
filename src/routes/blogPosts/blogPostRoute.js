import express from "express";
import createHttpError from "http-errors";
import blogPostModel from "./blogPostModel.js";
import commentModel from "./commentModel.js";
import q2m from "query-to-mongo";
import { checksLoginMiddleware } from "../auth/checksLogin.js";
import { onlyUserMiddleware } from "../auth/onlyUser.js";

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
    const q2mQuery = q2m(req.query);
    console.log(q2mQuery);
    const { totalPosts, blogPosts } =
      await blogPostModel.findBlogPostWithAuthors(q2mQuery);
    res.send({ totalPosts, blogPosts });
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
      next(createHttpError(404, `Blog Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.put(
  "/:_id",
  checksLoginMiddleware,
  onlyUserMiddleware,
  async (req, res, next) => {
    try {
      const id = req.params._id;
      const modifiedUser = await blogPostModel.findByIdAndUpdate(id, req.body, {
        new: true, // returns the modified user
      });

      if (modifiedUser) {
        res.send(modifiedUser);
      } else {
        next(createHttpError(404, `Blog Post with id ${id} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostRoute.delete(
  "/:_id",
  checksLoginMiddleware,
  onlyUserMiddleware,
  async (req, res, next) => {
    try {
      const id = req.params._id;

      const deletedUser = await blogPostModel.findByIdAndDelete(id);

      if (deletedUser) {
        res.status(204).send();
      } else {
        next(createHttpError(404, `Blog Post with id ${id} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostRoute.get("/:_id/comments/", async (req, res, next) => {
  try {
    const id = req.params._id;
    const blogPost = await blogPostModel.findById(id);
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(createHttpError(404, `Blog Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.get("/:_id/comments/:commentId", async (req, res, next) => {
  try {
    const id = req.params._id;
    const blogPost = await blogPostModel.findById(id);
    if (blogPost) {
      const blogPostComment = blogPost.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (blogPostComment) {
        res.send(blogPostComment);
      } else {
        next(createHttpError(404, `Comment with id ${id} not found!`));
      }
      // res.send(blogPost.comments);
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.post("/:_id/comments/", async (req, res, next) => {
  try {
    const updatedBlogPost = await blogPostModel.findByIdAndUpdate(
      req.params._id,
      { $push: { comments: req.body } },
      // { $push: { comments: mongoose.Types.ObjectId(id) } },
      { new: true }
    );
    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(createHttpError(404, `Blog Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.put("/:_id/comments/:commentId", async (req, res, next) => {
  try {
    const blogPost = await blogPostModel.findById(req.params._id);

    if (blogPost) {
      const index = blogPost.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        blogPost.comments[index] = {
          ...blogPost.comments[index].toObject(),
          ...req.body,
        };
        await blogPost.save();
        res.send(blogPost);
      } else {
        next(createHttpError(404, `Blog Post with id ${id} not found!`));
      }
    }
  } catch (error) {
    next(error);
  }
});

blogPostRoute.delete("/:_id/comments/:commentId", async (req, res, next) => {
  try {
    const id = req.params._id;
    const blogPost = await blogPostModel.findByIdAndUpdate(
      id,
      {
        $pull: { comments: { _id: req.params.commentId } },
      },
      { new: true }
    );
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createHttpError(404, `Blog Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostRoute;
