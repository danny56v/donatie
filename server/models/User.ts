import mongoose, { model, Schema } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  username?: string;
  email: string;
  password?: string;
  productsId: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: false },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false, unique: false },
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
