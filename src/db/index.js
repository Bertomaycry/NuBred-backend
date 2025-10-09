import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `✅ Connected to DB: ${process.env.DB_NAME} on host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`❌ Error connecting DB: ${error}`);
  }
};

export default connectDB;
