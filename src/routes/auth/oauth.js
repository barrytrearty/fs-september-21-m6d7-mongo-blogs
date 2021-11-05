import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import authorModel from "../authors/authorModel.js";
import { JWTAuthenticate } from "./jwtTools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `http://localhost:5000/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, googleProfile, passportNext) => {
    try {
      const author = await authorModel.findOne({ googleId: googleProfile.id });

      if (author) {
        const token = await JWTAuthenticate(author);
        passportNext(null, token);
      } else {
        const newAuthor = {
          name: googleProfile.name.givenName,
          surname: googleProfile.name.familyName,
          email: googleProfile.emails[0].value,
          googleId: googleProfile.id,
        };

        const createdAuthor = new authorModel(newAuthor);
        const savedAuthor = await createdAuthor.save();

        const token = await JWTAuthenticate(savedAuthor);

        passportNext(null, token);
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});

export default googleStrategy;
