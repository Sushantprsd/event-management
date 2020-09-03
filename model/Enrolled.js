const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EnrolledSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", index: true, require: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true, require: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    },
);

EnrolledSchema.index({eventId: 1, userId: 1}, {unique: true}, {index:true})

module.exports = mongoose.model("Enrolled", EnrolledSchema);
