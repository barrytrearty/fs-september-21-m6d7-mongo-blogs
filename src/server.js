import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import listEndpoints from "express-list-endpoints";
import blogPostRoute from "./routes/blogPosts/blogPostRoute.js";
import authorRoute from "./routes/authors/authorRoute.js";
import GoogleStrategy from "./routes/auth/oauth.js";

const server = express();
const port = process.env.PORT || 5000;

passport.use("google", GoogleStrategy);

server.use(cors());
server.use(express.json());

server.use(passport.initialize());

server.use("/blogPosts", blogPostRoute);
server.use("/authors", authorRoute);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log("Server is stoppped ", error);
});
