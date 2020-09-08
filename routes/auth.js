const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { check, body } = require("express-validator");

router.post(
    "/signup",
    [
        body("email").trim().isEmail().normalizeEmail().withMessage("Please enter a valid email address."),
        body("password", "Password should have length greater than 4.")
            .trim() 
            .isLength({ min: 5 }),
    ],

    authController.postSignup,
);
router.post(
    "/login",
    [
        body("email").trim().isEmail().normalizeEmail().withMessage("Please enter a valid email address."),
        body("password", "password", "Password should have length greater than 4.")
            .trim()
            .isLength({ min: 5 }),
    ],
    authController.postLogin,
);

module.exports = router;
