import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";

const connectDB = async () => {


  console.log(process.env.MONGODB_URI,'db_url');
  

  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected successfully to host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Error connecting DB : ${error}`);
  }
};

export default connectDB;
