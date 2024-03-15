const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//signup
exports.signUp = async(req, res) => {
    try{
        //data fetch from req body
        const {
            name,
            email,
            password,
            confirmPassword,
            image,
            accountType,
        } = req.body;

        //validate the data
        if(!name || !email || !password || !confirmPassword){
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }

        //check if user with same email already exists
        let existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json(
                {
                    success: false,
                    message: "User already registered, go to login"
                }
            )
        }

        //match the 2 passwords
        if(password !== confirmPassword){
            return res.status(400).json(
                {
                    success: false,
                    message: "Password and confirmPassword do not match"
                }
            )
        }

        //HASH the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return res.status(500).json(
                {
                    success: false,
                    message: "Error in hashing password"
                }
            )
        }

        //create entry in DB
        const user = await User.create({
            name, 
            email,
            password: hashedPassword,
            image: image ? image : `https://api.dicebear.com/6.x/initials/svg?seed=${name}`,
            accountType
        })

        //return successfull response
        res.status(200).json(
            {
                success: true,
                message: "User registered successfully",
                user
            }
        )
    }
    catch(error){
        console.log("Error in registering user-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in registering user"
            }
        )
    }
}

//login
exports.login = async(req,res) => {
    try{
        //fetch data from req body
        const {email, password} = req.body;

        //validate the data
        if(!email || !password){
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }
        
        //check if user exists or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json(
                {
                    success: false,
                    message: "User not registered, please signup first"
                }
            )
        }

        //match the password
        if(await bcrypt.compare(password, user.password)){
            //now passwords are matched

            //generate JWT
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            user.token = token;
            user.password = undefined;  //make the password field undefined as we are going to send it in response
                                        //so that hacker can't steal it

            //define options to send in cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), //cookie expires in 3 days (it is in milliseconds)
                httpOnly: true                                //httpOnly means client cannot access the cookie (for security)
            }

            res.cookie("token", token, options).status(200).json(         //sending cookie in response
                {
                    success: true,
                    token,
                    user,
                    message: "User logged in successfully"
                }
            )
        }
        else{
            //passwords do not match
            return res.status(401).json(           
                {
                    success: false,
                    message: "Password do not match"
                }
            )
        }

    }
    catch(error){
        console.log("Error in logging user-> ", error);
        res.status(500).json(
            {
                success: false,
                message: "Error in logging user"
            }
        )
    }
}