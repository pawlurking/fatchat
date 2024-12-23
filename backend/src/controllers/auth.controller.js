import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  // res.send("signup route")

  // extract the content of the request
  const { fullname, email, password } = req.body;
  // hashing password using bcryptjs
  // orient@123 (user typed) -> bcryptjs -> token (to be stored our db)

  try {
    // initially, make sure all needed fields are typed
    if (!fullname || !email || !password) {
      return res.status(400).json({message: "All fields are required!"});
    }
    // first: check min length requirement for password
    if (password.length < 8) {
      return res.status(400).json({message: "Password must be at least 8 characters!"});
    }

    // second: check whether the user exists ?
    const user = await User.findOne({email});
    if (user) {
      return res.status(400).json({message: "Email already exists!"});
    }

    // third: hash the user raw password
    // 10: is the commission we put
    const salt = await bcrypt.genSalt(10);
    const hashedPWD = await bcrypt.hash(password, salt);
    const newUser = new User(
      {
        fullname: fullname,
        email: email,
        password: hashedPWD
      }
    )

    // fourth: generate jwt token
    if (newUser) {
      generateToken(newUser._id, res)
      // then, save the user in db
      await newUser.save();
      // then, return success message to confirm user
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        avatar: newUser.avatar
      })

    } else {
      res.status(400).json({message: "Invalid user data!"})
    }

  } catch (error) {
    console.log(`Error in signup controller: ${error.message}`);
    res.status(500).json({message: "Internal Server Error!"});
  }
    
};

export const login = async (req, res) => {
  // res.send("login route")

  // first, de-construct the content of request
  // to extract email, password
  const {email, password} = req.body
  try {

    // second, use email to find user in our db
    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({message: "Invalid credentials"})
    }

    // third, use bcrypt.compare() to check user password
    // compare(raw_user_pwd, the password token associated with this user from our db )
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return req.status(400).json({message: "Invalid credentials"})
    }

    // after checking login credentials successfully,
    // we return confirm message + jwt cookies
    generateToken(user._id, res);

    res.status(200).json(
      {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar
      }
    )

  } catch (error) {
    console.log(`Error in login controller ${error.message}`);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const logout = (req, res) => {
  // res.send("logout route")
  // if user make a logout, we then clear cookies
  try {
    res.cookie("tokenJWT", "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});

  } catch (error) {
    console.log(`Error in logout controller ${error.message}`);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {avatar} = req.body;
    const userID = req.user._id;

    if (!avatar) {
      return res.status(400).json({message: "Avatar photo is required!"})
    }

    const cloudinaryRES = await cloudinary.uploader.upload(avatar);
    const avatarURL = cloudinaryRES.secure_url;
    const updatedUser = await User.findByIdAndUpdate(userID, {avatar:avatarURL}, {new:true});

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log(`Error in update avatar: ${error}`);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const checkAuth = (req, res) => {
  try {
    // check if user exists in the request they sent
    res.status(200).json(req.user);
  } catch (error) {
    console.log(`Erroor in checkAuth controller ${error.message}`);
    res.status(500).json({message: "Internal Server Error"})
  }
}


// XphSt25KKCiq3xuL