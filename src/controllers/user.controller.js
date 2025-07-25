import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import admin from "../utils/firebase.js";

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
      data: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        account_created: user.account_created,
        is_onboarded: user.is_onboarded,
        is_account_created_skipped: user.is_account_created_skipped,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      message: "Users fetched Successfully",
      data: users,
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
    throw new Error(
      "Something went wrong while generating token: " + error.message
    );
  }
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
        profile: user.profile,
        profile_type: user.profile_type,
        account_created: user.account_created,
        is_onboarded: user.is_onboarded,
        is_account_created_skipped: user.is_account_created_skipped,
        ban: user.ban,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: undefined,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});

export const handleSocialLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found in token",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      let firstName = "";
      let lastName = "";
      if (name) {
        const nameParts = name.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ") || "";
      }

      const randomPassword = Math.random().toString(36).slice(-8);

      user = await User.create({
        firstName,
        lastName,
        email,
        password: randomPassword,
        phoneNumber: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Social login successful",
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        accessToken,
        refreshToken,
        profile: user.profile,
        profile_type: user.profile_type,
        account_created: user.account_created,
        is_onboarded: user.is_onboarded,
        is_account_created_skipped: user.is_account_created_skipped,
        ban: user.ban,
      },
    });
  } catch (error) {
    console.error("Social login failed:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

export const completeOnboarding = asyncHandler(async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndUpdate(userId, { is_onboarded: true });
    res.status(200).json({
      success: true,
      message: "Onboarding complete",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});

export const accountCreationChecked = asyncHandler(async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndUpdate(userId, { is_account_created_skipped: true });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ?? "Something went wrong",
    });
  }
});

export const banUser = async (req, res) => {
  const { userId, ban } = req.body;

  if (!userId || !ban || !ban.type || !ban.reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const banData = {
    is_banned: true,
    type: ban.type,
    reason: ban.reason,
    period: ban.type === "Temporary" ? ban.period : null,
  };

  user.ban = banData;

  await user.save();

  res.status(200).json({
    success: true,
    message: `User has been banned (${ban.type}ly)`,
  });
};

export const removeBan = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "No user selected" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const banData = {
    is_banned: false,
  };

  user.ban = banData;

  await user.save();

  res.status(200).json({
    success: true,
    message: `Ban has been removed successfully`,
  });
};
export const updateBan = async (req, res) => {
  const { userId, ban } = req.body;

  if (!userId || !ban || !ban.type || !ban.reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const banData = {
    is_banned: true,
    type: ban.type,
    reason: ban.reason,
    period: ban.type === "Temporary" ? ban.period : null,
  };

  user.ban = banData;

  await user.save();

  res.status(200).json({
    success: true,
    message: `User has been banned updated`,
  });
};
