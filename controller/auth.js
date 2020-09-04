const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                const error = new Error("User Already Exist");
                error.statusCode = 401;
                throw error;
            }
            return bcrypt.hash(password, 12);
        })
        .then((hashPassword) => {
            const newUser = new User({
                email: email,
                password: hashPassword,
                public:{
                    name:name
                }
            });
            return newUser.save();
        })
        .then((user) => {
            const token = jwt.sign(
                {
                    userId: user._id,
                },
                process.env.JWT_SECRET,
            );
            res.status(201).json({
                message: "User Created",
                token: token,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser = null;
    User.findOne({ email: email },{_id:1,password:1,"public.name":1})
        .then((user) => {
            if (!user) {
                const error = new Error("User Doesn't Exist");
                error.statusCode = 404;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error("Password not match");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    userId: loadedUser._id,
                },
                process.env.JWT_SECRET,
            );
            res.status(200).json({
                message: "User Found",
                token: token,
                user
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};