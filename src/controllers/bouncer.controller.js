const Bouncer = require("../models/bouncer.model.js");
const bcrypt = require("bcryptjs");

// Step 1: Create bouncer account
exports.createBouncerAccount = async (req, res) => {
  try {
    const { email, password, authType, googleId } = req.body;

    // Check if email exists
    const existing = await Bouncer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const bouncer = new Bouncer({
      email,
      password: hashedPassword,
      authType,
      googleId,
    });

    const savedBouncer = await bouncer.save();
    res.status(201).json(savedBouncer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 2: Add physical details
exports.updateBouncerDetails = async (req, res) => {
  try {
    const { height, weight, bicepSize, location } = req.body;

    const bouncer = await Bouncer.findById(req.params.id);
    if (!bouncer) return res.status(404).json({ message: "Bouncer not found" });

    // Must be at least accountCreated stage
    if (bouncer.registrationStage !== "accountCreated") {
      return res
        .status(400)
        .json({ message: "Invalid stage to update details" });
    }

    bouncer.height = height;
    bouncer.weight = weight;
    bouncer.bicepSize = bicepSize;
    bouncer.location = location;
    bouncer.registrationStage = "detailsSubmitted";

    const updated = await bouncer.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 3: Schedule verification
exports.scheduleVerification = async (req, res) => {
  try {
    const { verificationDate } = req.body;

    const bouncer = await Bouncer.findById(req.params.id);
    if (!bouncer) return res.status(404).json({ message: "Bouncer not found" });

    if (bouncer.registrationStage !== "detailsSubmitted") {
      return res
        .status(400)
        .json({ message: "Invalid stage to schedule verification" });
    }

    bouncer.verificationDate = verificationDate;
    bouncer.verificationStatus = "pending";
    bouncer.registrationStage = "verificationScheduled";

    const updated = await bouncer.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 4: Verify and give membership
exports.verifyBouncer = async (req, res) => {
  try {
    const { membershipStart, membershipEnd } = req.body;

    const bouncer = await Bouncer.findById(req.params.id);
    if (!bouncer) return res.status(404).json({ message: "Bouncer not found" });

    if (bouncer.registrationStage !== "verificationScheduled") {
      return res
        .status(400)
        .json({ message: "Invalid stage to verify member" });
    }

    bouncer.verificationStatus = "verified";
    bouncer.membershipStatus = "active";
    bouncer.membershipStart = membershipStart;
    bouncer.membershipEnd = membershipEnd;
    bouncer.registrationStage = "verifiedMember";

    const updated = await bouncer.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generic: Get all bouncers
exports.getAllBouncers = async (req, res) => {
  try {
    const bouncers = await Bouncer.find();
    res.json(bouncers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic: Get one bouncer
exports.getBouncerById = async (req, res) => {
  try {
    const bouncer = await Bouncer.findById(req.params.id);
    if (!bouncer) return res.status(404).json({ message: "Bouncer not found" });
    res.json(bouncer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic: Update any field (Admin use)
exports.updateBouncer = async (req, res) => {
  try {
    const updated = await Bouncer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Bouncer not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generic: Delete bouncer
exports.deleteBouncer = async (req, res) => {
  try {
    const deleted = await Bouncer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Bouncer not found" });
    res.json({ message: "Bouncer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
