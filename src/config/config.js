// config/config.js

const User = require("../models/User");

// Helper function to generate a random username
const generateUsername = (name) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    const specialChars = '!@#$'; // Set of special characters
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)]; // Pick a random special char
    return `${name}_${randomNum}${randomSpecialChar}`; // Combine name, number, and special char
  };
  
  // Helper function to ensure the username is unique
  exports.generateUniqueUsername = async (name) => {
    let username = generateUsername(name);
    let userExists = await User.findOne({ username });
  
    // Keep generating a new username until we find one that's unique
    while (userExists) {
      username = generateUsername(name);
      userExists = await User.findOne({ username });
    }
    return username;
  };
  