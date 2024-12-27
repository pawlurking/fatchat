import {Server} from "socket.io";
import http from "http";
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],

  }
})

// return socketID when passing userID
export function getReceiverSocketID (userID) {
  return userSocketMap[userID];
}

// store online Users in {userID: socketID}
// userID from db; socketID: socket (server) <- socket client
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  // socket.id = Date.now();

  const userID = socket.handshake.query.userID;

  if (userID) {
    userSocketMap[userID] = socket.id
  }

  // io.emit() will broadcast to every single user that is connected
  // send events to call connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
    // delete userID if they out
    delete userSocketMap[userID];
    // let online users be informed of this user's logout
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })

})

export {io, app, server};