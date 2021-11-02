import createHttpError from "http-errors";
import atob from "atob";
import authorModel from "../authors/authorModel.js";

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "No authorization"));
  } else {
    const decodedUsernameAndPassword = atob(
      req.headers.authorization.split(" ")[1] //This gets rid of the "basic "
    );
    const [username, password] = decodedUsernameAndPassword.split(":");

    const author = await authorModel.checkCredentials(username, password);

    if (author) {
      req.author = author;
      next();
    }
  }
};
