const mongoose = require("mongoose");

const imagePostSchema = new mongoose.Schema(
    {
        image:{
            type: String,
        },
        adminDetails:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    }
);

module.exports = mongoose.model("ImagePost", imagePostSchema);