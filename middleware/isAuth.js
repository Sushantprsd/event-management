const jwt = require("jsonwebtoken");
const User = require("../model/User");

module.exports = (req, res, next) => {
    const authorizationHeader = req.get("Authorization");
    if (!authorizationHeader) {
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        throw error;
    }
    const token = authorizationHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        throw error;
    }
    User.findOne({ _id: decodedToken.userId },{password:0})
        .then((user) => {
            if (!user) {
                const error = new Error("User doesn't exist");
                error.statusCode = 404;
                throw error;
            }
            req.user = user;
            req.userId = user._id;
            next();
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};
