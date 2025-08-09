const mongoose = require("mongoose");

const bouncerSchema = new mongoose.Schema(
  {
    // Step 1: Account creation
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false, minlength: 8 },
    authType: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, unique: true, sparse: true },

    // Step 2: Physical details & location
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    bicepSize: { type: Number }, // in cm
    location: { type: String },

    // Step 3: Verification scheduling
    verificationDate: { type: Date }, // date when verification will occur
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    // Step 4: Membership
    membershipStatus: {
      type: String,
      enum: ["none", "active", "expired"],
      default: "none",
    },
    membershipStart: { type: Date },
    membershipEnd: { type: Date },

    // Track progress
    registrationStage: {
      type: String,
      enum: [
        "accountCreated",
        "detailsSubmitted",
        "verificationScheduled",
        "verifiedMember",
      ],
      default: "accountCreated",
    },

    // Optional profile image
    image: { type: String },

    // Contact info
    phone: { type: String },
  },
  { timestamps: true, strict: "throw" }
);

module.exports = mongoose.model("Bouncer", bouncerSchema);