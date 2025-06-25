import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.Model.js";
import bcrypt from "bcrypt";

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      let message = "User already exists";
      if (existingUser.email === email) {
        message = "Email is already taken";
      } else if (existingUser.phoneNumber === phoneNumber) {
        message = "Phone number is already taken";
      }
      return res.status(400).json({
        success: false,
        message,
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating token: " + error.message);
  }
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});
