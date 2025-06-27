import Company from "../models/CompanyProfile.model.js";
import Consultant from "../models/ConsultantProfile.model.js";
import User from "../models/user.model.js";

export const createUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_type, profile_data } = req.body;

    if (!["company", "consultant"].includes(profile_type)) {
      return res.status(400).json({ message: "Invalid profile type." });
    }

    const existingUser = await User.findById(userId);
    if (existingUser?.profile) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Profile already exists for this user.",
        });
    }

    let createdProfile;

    if (profile_type === "company") {
      createdProfile = await Company.create({
        ...profile_data,
        user: userId,
      });
    } else {
      createdProfile = await Consultant.create({
        ...profile_data,
        user: userId,
      });
    }

    existingUser.account_created = true;
    existingUser.profile_type = profile_type;
    existingUser.profile = createdProfile._id;
    await existingUser.save();

    res.status(201).json({
      success: true,
      message: `${profile_type} profile created successfully.`,
      profile_id: createdProfile._id,
      data: createdProfile,
    });
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Server error while creating profile." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password -refreshToken")
      .populate("profile");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        account_created: user.account_created,
        profile_type: user.profile_type,
        profile: user.profile,
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};
