const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming the User model is defined in this path
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

    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save the user to the database
    await user.save();

    return res.status(200).json({
      status: true,
      message: "User registered successfully",
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

    // If the password is valid, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token and success message
    return res.status(200).json({
      status: true,
      message: "User signed in successfully",
      user:user,
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
