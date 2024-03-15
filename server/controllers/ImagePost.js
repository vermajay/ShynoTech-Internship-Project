const ImagePost = require('../models/ImagePost');
const User = require('../models/User');

//get all imagePosts from DB
exports.getAllImagePosts = async(req, res) => {
    try{
        const allImagePosts = await ImagePost.find({}).populate({
            path: 'adminDetails',
            select: '-password' // Exclude the password field
          })
          .exec();

        res.status(200).json(
            {
                success: true,
                message: "All image posts fetched successfully",
                allImagePosts
            }
        )
    }
    catch(error){
        res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}


//upload a new image post
exports.uploadImagePost = async(req, res) => {
    try{
        const {image} = req.body;

        //validation
        if(!image){
            return res.status(400).json(
                {
                    success: false,
                    message: "Image not found"
                }
            )
        }

        const userId = req.user.id;    //auth middleware added this in req

        // get admin details
        const adminDetails = await User.findById(userId, {
            accountType: "Admin",
        })
    
        if (!adminDetails) {
            return res.status(404).json({
            success: false,
            message: "Admin Details Not Found",
            })
        }
        
        //create entry for new image post
        const newImagePost = await ImagePost.create({
            image: image,
            adminDetails: userId
        });

        //add the new course to the courses field of the user(instructor)
        await User.findByIdAndUpdate(userId, {$push:{imagePosts:newImagePost._id}}, {new:true});

        //return responses
        res.status(200).json(
            {
                success: true,
                message: "Image post created successfully",
                newImagePost
            }
        )
    }
    catch(error){
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: "Error in creating image post",
                error: error.message
            }
        )
    }
}