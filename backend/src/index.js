// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app, server} from "./lib/socket.js";
import path from "path";


dotenv.config()

// const app = express();
const portNumber = process.env.portNumber;
const __dirname = path.resolve();

// This allow us to parse JSON bodies
app.use(express.json());
// This allows us to parse the cookies
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if we currently in production, use dist of frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // if we visit any routes than "/api/auth" or "/api/messages", we would like to see entry point of our react application
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

server.listen(portNumber, () => {
  console.log(`Server is running on port ${portNumber}`);
  connectDB()
});