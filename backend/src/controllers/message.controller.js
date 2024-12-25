import cloudinary from '../lib/cloudinary.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    // extract the current user ID
    const loggedInUserID = req.user._id;
    // get all users from db except the very current user
    const filteredUsers = await User.find({_id: {$ne:loggedInUserID}}).select("-password");

    res.status(200).json(filteredUsers);
    
  } catch (error) {
    console.error(`Error in getUsersForSider: ${error.message}`);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export const getMessages = async (req, res) => {
  try {
    const {id:user2ChatID} = req.params;
    const meID = req.user._id;

    const messages = await Message.find(
      {
        $or: [
          {senderID:meID, receiverID:user2ChatID},
          {senderID:user2ChatID, receiverID:meID},
        ]
      }
    )

    res.status(200).json(messages);

  } catch (error) {
    console.log(`Error in getMessages controller: ${error.message}`);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body;
    const {id:user2ChatID} = req.params;
    const meID = req.user._id;

    let imageURL;
    if (image) {
      // Upload base64 image to cloudinary
      const cloudinaryRES = await cloudinary.uploader.upload(image);
      imageURL = cloudinaryRES.secure_url;
    }

    const newMessage = new Message(
      {
        senderID: meID,
        receiverID: user2ChatID,
        text: text,
        image: imageURL,
      }
    )

    // send the new message
    await newMessage.save();

    // to-do: realtime functionality goes here => socket.io

    res.status(201).json(newMessage);

  } catch (error) {
    console.log(`Error in sendMessage controller: ${error.message}`);
    res.status(500).json({message:"Internal Server Error"});
  }
}