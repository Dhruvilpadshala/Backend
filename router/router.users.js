const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users.controller");
const loginController = require("../controller/login.controller");

// Route for user registration (sign-up)
router.post("/signup", UsersController.signUp);

// Route for user login
router.post("/login", loginController.login);

module.exports = router;
