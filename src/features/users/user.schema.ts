import mongoose, { Document } from "mongoose";
import { UserRoles } from "./utils/user.enum";

interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  role: UserRoles;
  shop_name: string | null;
}

const userSchema = new mongoose.Schema<IUser>({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRoles),
    default: UserRoles.USER,
  },
  shop_name: { type: String, default: null },
});

export const User = mongoose.model("User", userSchema);
