import createHttpError from "http-errors";
import atob from "atob";
import blogPostModel from "../blogPosts/blogPostModel.js";

export const onlyUserMiddleware = async (req, res, next) => {
  const blog = await blogPostModel.findById(req.params._id);
  if (blog.authors[0].toString() === req.author._id.toString()) {
    req.blog = blog;
    next();
  } else {
    res.status(403).send({ message: "Not authorised" });
    return;
  }
};
