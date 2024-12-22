import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    }, 

    fullname: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    avatar: {
      type: String,
      default: "",
    }
  },

  {
    timestamps: true, // tracking member since ...
  }
)

const User = mongoose.model("User", userSchema);
// mongoDB will auto-convert "User" into "users"
export default User;
