const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    public:{
        name:{
            type: String,
            index: true,
            required: true,
        }
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// AuthSchema.index({ "public.userName": 1 }, { unique: true }, { index: true });

module.exports = mongoose.model("User", UserSchema);
