const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new Schema(
    {
        public: {
            name: {
                type: String,
                required: true,
                index:true
            },
            date:{
                type:Date,
                required:true
            },
            time:{
                type:String,
                required:true
            },
            location: {
                state: {
                    type: String,
                    required: true,
                    index:true
                },
                city: {
                    type: String,
                    required: true,
                },
                landmark: {
                    type: String,
                    required: true,
                },
                coordinates: {
                    type: { type: String, required: true },
                    coordinates: [Number],
                },
            },
            
            description: {
                type: String,
            },
            organizerName: {
                type: String,
                required: true,
                index:true
            },
            imageUrl:{
                type:String,
                required:true
            }
        },
        status: {
            type: String,
            default: "onLine",
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            require: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    },
);

module.exports = mongoose.model("Event", EventSchema);
