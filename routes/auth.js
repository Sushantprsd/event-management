const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { check, body } = require("express-validator");

router.post(
    "/signup",
    [
        body("email").isEmail().trim().normalizeEmail().withMessage("Please enter a valid email address."),
        body("password", "Password has to be valid.")
            .trim() //remove excess white spacce
            .isLength({ min: 5 }),
    ],

    authController.postSignup,
);
router.post(
    "/login",
    [
        body("email").trim().isEmail().normalizeEmail().withMessage("Please enter a valid email address."),
        body("password", "Password has to be valid.")
            .trim() //remove excess white spacce
            .isLength({ min: 5 }),
    ],
    authController.postLogin,
);

module.exports = router;
