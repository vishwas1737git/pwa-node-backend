const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming the User model is defined in this path
const { generateUniqueUsername } = require("../config/config");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ideally, store this in .env

exports.SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("----------------req.body", req.body);

  try {
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields (name, email, password) are required.",
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: false,
        message: "Email is already registered.",
      });
    }

    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique username and await the result
    const username = await generateUniqueUsername(name);

    // Create a new user with the hashed password and generated username
    const user = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      username, // Use the generated unique username
    });

    // Save the user to the database
    await user.save();

    return res.status(200).json({
      status: true,
      message: "User registered successfully",
      data: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.SignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User does not exist.",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: true,
      message: "User signed in successfully",
      user: user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      status: true,
      message: "User profile fetched successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  const { bio, location, emailContact, username } = req.body;

  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (emailContact) user.emailContact = emailContact;
    username ? (user.username = username) : (user.username = user.username);

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: {
        bio: user.bio,
        location: user.location,
        emailContact: user.emailContact,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};
