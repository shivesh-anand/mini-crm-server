import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel, { IUser } from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

export default (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ googleId: profile.id });

          if (!user) {
            user = await userModel.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0].value,
            } as IUser);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
