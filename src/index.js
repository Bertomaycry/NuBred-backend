import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

connectDB()
  .then(() => {
    const app = express();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error connecting DB : ${error}`);
  });
