import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/user.Model";

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  const user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});
