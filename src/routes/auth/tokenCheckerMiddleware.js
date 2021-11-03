import createHttpError from "http-errors";
import { verifyJWT } from "./jwtTools.js";
import authorModel from "../authors/authorModel.js";

export const tokenCheckerMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(401, "Please provide credentials in Authorization header")
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decodedToken = await verifyJWT(token);
      console.log("DECODED TOKEN ", decodedToken);
      const user = await authorModel.findById(decodedToken._id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found!"));
      }
    } catch (error) {
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
