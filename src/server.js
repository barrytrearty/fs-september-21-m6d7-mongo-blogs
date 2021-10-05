import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import blogPostRoute from "./routes/blogPosts/blogPostRoute.js";

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.json());

server.use("/blogPosts", blogPostRoute);

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
