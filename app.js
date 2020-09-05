require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const path = require("path");

let PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGOODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
            next();
        });
        app.use(express.static(path.join(__dirname, "public")));
        app.get("/", (req, res, next) => {
            res.status(200).json({
                message: "working",
            });
        });
        app.use("/auth", authRouter);
        app.use("/user", userRouter);
        app.use("/event", eventRouter);
        app.use((error, req, res, next) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            if (!error.message) {
                error.message = "Internal Server Error";
            }
            return res.status(error.statusCode).json({
                message: error.message,
                code: error.statusCode,
            });
        });

        app.listen(PORT, () => {
            console.log("server started at http://localhost:5000");
        });
    })
    .catch((err) => {
        console.log(err);
    });
