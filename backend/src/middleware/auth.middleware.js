import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const shieldRoute = async (req, res, nextFunction) => {
  try {
    const token = req.cookies.tokenJWT;

    // check if the token exists ?
    if (!token) {
      return res.status(401).json({message: "Unauthorized - No Token Provided!"});
    }

    // decode the cookie to wrap userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({message: "Unauthorized - Invalid Token!"});
    }

    // const user = await User.findById(decoded).select("-password");
    // if (!user) {
    //   return res.status(404).json({message: "User not found"});
    // }

    const decodedUserID = decoded.userID;
    const user = await User.findById(decodedUserID).select("-password");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // if all above passed, now user is authenticated
    // then we add user's fields to the request
    // this means the content of the request of this 
    // user now become of all fields except password 
    // got from our db
    req.user = user;
    // then, we proceed to call updateProfile()
    nextFunction();

  } catch (error) {
    console.log(`Error in shieldRoute middleware ${error.message}`);
    res.status(500).json({message: "Internal Server Error"});
  }
};