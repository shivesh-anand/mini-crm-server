import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: any, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

export default router;
