import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
export const Message = mongoose.model("Message", MessageSchema);
