const express = require("express");
const router = express.Router();
const bouncerController = require("../controllers/bouncerController");

// STEP 1: Create bouncer account
router.post("/", bouncerController.createBouncerAccount);

// STEP 2: Add physical details
router.patch("/:id/details", bouncerController.updateBouncerDetails);

// STEP 3: Schedule verification
router.patch(
  "/:id/schedule-verification",
  bouncerController.scheduleVerification
);

// STEP 4: Verify & provide membership
router.patch("/:id/verify", bouncerController.verifyBouncer);

// GENERIC CRUD
router.get("/", bouncerController.getAllBouncers);
router.get("/:id", bouncerController.getBouncerById);
router.put("/:id", bouncerController.updateBouncer); // For admin/complete update
router.delete("/:id", bouncerController.deleteBouncer);

module.exports = router;
