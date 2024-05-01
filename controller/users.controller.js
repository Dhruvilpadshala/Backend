// Assuming you have already set up your Express server
const express = require("express");
const router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
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

    //sendmail
    const sendVerifyEmail = async (username, email, userId) => {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          requireTLS: true,
          auth: {
            user: "padasaladhruvil@gmail.com",
            pass: process.env.PASSWORD,
          },
          debug: true,
        });
        const mailOptions = {
          from: "padasaladhruvil@gmail.com",
          to: email,
          subject: "Welcome to Our Website!",
          text: `Dear ${username},\n\nWelcome to our website! Your account has been successfully created.\n\nThank you for joining us.\n\nSincerely,\nThe Website Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };
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
    sendVerifyEmail(username, email, newUser._id);
    res.status(201).json({ newUser, message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verify = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's verified status in the database
    user.verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUp,
  verify,
};
