import Message from "../models/message.models";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket";

export const getUsersForSidebar = async (req, res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");
    } catch(error){
        res.status(500).json({message:"Internal Server Error "})
    }
}