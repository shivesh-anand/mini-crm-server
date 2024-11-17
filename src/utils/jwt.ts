// backend/utils/jwt.ts
import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, displayName: user.displayName, email: user.emails[0].value },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
};
