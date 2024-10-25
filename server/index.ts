import express from "express";

import dotenv from "dotenv"; 
import mongoose from "mongoose";

import authRouter from './routes/auth.route'

dotenv.config();
const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello World"); 
// });



main().catch((err) => console.log(err));
  
async function main() { 
  await mongoose.connect(process.env.MONGO_URL);
  console.log('DATABASE CONNECTED')
}


app.use('/api/auth', authRouter)

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
