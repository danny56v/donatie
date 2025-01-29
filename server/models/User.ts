import mongoose, { model, Schema } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  googleId?: string;
  username?: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  productsId: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, unique: false },
    lastName: {type: String, required: true, unique: false},
    googleId: { type: String, required: false },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false, unique: false },
    isAdmin: { type: Boolean, required: true, default: false },
    productsId: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;

// import { model, Schema } from "mongoose";
// export interface IUser {
//   _id: string;
//   googleId?: String;
//   username: string;
//   email: string;
//   password: string;
// }

// const userSchema = new Schema<IUser>(
//   {
//     googleId: { type: String, required: false },
//     username: { type: String, required: true, unique: true, index: true },
//     email: { type: String, required: true, unique: true, index: true },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const User = model<IUser>("User", userSchema);

// export default User;
