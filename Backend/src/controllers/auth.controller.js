import { generateToken } from "../lib/utils.js";
import User  from "../routes/auth.route.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import UserModel from "../models/user.model.js";

export const signUp = async (req, res) => {
  console.log(" Received Data:", req.body);
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    console.log(" Missing required fields!");
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      console.log(" User already exists!");
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      fullname,
      email,
      password: hashedPassword,
    });
    
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      console.log(newUser);
      
      
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup Error: ", error); 
    res.status(500)
      .json({ message: "Internal server error While registering new user" });
  }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
      }

      generateToken(user._id, res);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
export const signOut = async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export const updataProfile = async (req, res)=>{
   try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (updatedUser) {
      return res.status(200).json(updatedUser);
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async(req,res)=>{
  try{
    res.status(200).json(req.user);
  }catch (error){
    res.status(500)
    .json({message: "Internal Server Error While checking Auth"})
  }
}