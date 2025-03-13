import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
email: { type: String, required: true },
fullname: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' 
  }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' 
  }],
},{ 
    timestamps: true 
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;