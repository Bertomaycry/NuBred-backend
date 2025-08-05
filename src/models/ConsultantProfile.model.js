import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    address: { type: String },
    postal_code: { type: String },
    country: { type: String },
  },
  { _id: false }
);

const personalInfoSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone_number: { type: String },
  },
  { _id: false }
);

const consultantProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    consultant_name: { type: String, required: true },
    consultant_email: { type: String, required: true },
    use_signup_email: { type: Boolean, default: false },

    description: { type: String },

    location: locationSchema,

    personal_info: personalInfoSchema,
    use_signup_info: { type: Boolean, default: false },
    use_signup_phone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("consultant", consultantProfileSchema);
