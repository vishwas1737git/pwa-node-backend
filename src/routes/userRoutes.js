// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authorization } = require("../middleware");

router.post("/login", userController.SignIn);
router.post("/register", userController.SignUp);
router.get("/profile", authorization, userController.getProfile);
router.post("/update-profile", authorization, userController.updateProfile);

module.exports = router;
