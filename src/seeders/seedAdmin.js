import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/user.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const existingAdmin = await User.findOne({ email: "admin@nubred.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists.");
            return process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Nubred@12", 10);

        await User.create({
            email: "admin@nubred.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("🎉 Admin created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        process.exit(1);
    }
}

createAdmin();
