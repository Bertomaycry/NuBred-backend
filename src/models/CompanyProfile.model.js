import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    address: { type: String },
    postal_code: { type: String },
    country: { type: String },
  },
  { _id: false }
);

const legalRepresentativeSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone_number: { type: String },
    whatsapp_number: { type: String },
  },
  { _id: false }
);

const companyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    legal_company_name: { type: String, required: true },
    country_of_incorporation: { type: String, required: true },
    vat_number: { type: String },
    company_email: { type: String, required: true },
    use_signup_email: { type: Boolean, default: false },

    description: { type: String },

    location: locationSchema,

    legal_representative: legalRepresentativeSchema,
    use_signup_info: { type: Boolean, default: false },
    use_signup_phone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("company", companyProfileSchema);
