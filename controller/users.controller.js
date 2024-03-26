// Assuming you have already set up your Express server

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // for generating JWT tokens
// Import your User model and any other necessary modules
const User = require("../DB/users");

// Route for user registration (sign-up)
const signUp = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Check if the email is already registered
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("newUser", newUser);

    res.status(201).json({ newUser, message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUp,
};
