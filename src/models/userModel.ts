import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
