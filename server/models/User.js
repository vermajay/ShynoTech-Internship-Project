const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            trim: true
        },
        password:{
            type: String,
            required: true
        },
        image:{
            type: String,
        },
        accountType:{
            type: String,
            enum: ["Admin", "User"],
            required: true
        },
        imagePosts:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ImagePost",
            }
        ]
    }
);

module.exports = mongoose.model("User", userSchema);