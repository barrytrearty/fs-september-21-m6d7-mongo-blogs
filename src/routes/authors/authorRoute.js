import express from "express";
import createHttpError from "http-errors";
import authorModel from "./authorModel.js";
import blogPostModel from "../blogPosts/blogPostModel.js";
import q2m from "query-to-mongo";
import { checksLoginMiddleware } from "../auth/checksLogin.js";
import { JWTAuthenticate } from "../auth/jwtTools.js";
import { tokenCheckerMiddleware } from "../auth/tokenCheckerMiddleware.js";
import passport from "passport";
import googleStrategy from "../auth/oauth.js";

const authorRoute = express.Router();

authorRoute.get("/", async (req, res, next) => {
  try {
    const authors = await authorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorRoute.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new authorModel(req.body);
    const { _id } = await newAuthor.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});

authorRoute.get("/me", tokenCheckerMiddleware, async (req, res, next) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// tokenCheckerMiddleware
authorRoute.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const author = await authorModel.checkCredentials(email, password);
    console.log(author);
    if (author) {
      const accessToken = await JWTAuthenticate(author);
      // const accessToken = await generateJWT(author);

      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

authorRoute.get(
  "/me/stories",
  tokenCheckerMiddleware,
  async (req, res, next) => {
    try {
      console.log(req.user._id);
      const posts = await blogPostModel.find({
        authors: req.user._id.toString(),
      });
      // const posts = await blogPostModel.find(req.user._id.toString());
      res.status(200).send(posts);
    } catch (error) {
      next(error);
    }
  }
);

//These routes would have to be admin only if they were implemented
// authorRoute.get("/:_id", async (req, res, next) => {
//   try {
//     const id = req.params._id;

//     const author = await authorModel.findById(id); // similar to findOne, but findOne expects to receive a query as parameter

//     if (author) {
//       res.send(author);
//     } else {
//       next(createHttpError(404, `Blog Post with id ${id} not found!`));
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// authorRoute.put("/:_id", async (req, res, next) => {
//   try {
//     const id = req.params._id;
//     const modifiedUser = await authorModel.findByIdAndUpdate(id, req.body, {
//       new: true, // returns the modified user
//     });

//     if (modifiedUser) {
//       res.send(modifiedUser);
//     } else {
//       next(createHttpError(404, `Author with id ${id} not found!`));
//     }
//   } catch (error) {
//     next(error);
//   }
// });

authorRoute.delete("/:_id", async (req, res, next) => {
  try {
    const id = req.params._id;

    const deletedUser = await authorModel.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Author with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//GOOGLE AUTHENTICATION ROUTES

authorRoute.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authorRoute.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log(req);
      res.redirect(
        `http://localhost:3000?accessToken=${req.author.token.accessToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

export default authorRoute;
