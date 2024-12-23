// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config()

const app = express();
const portNumber = process.env.portNumber;


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

app.listen(portNumber, () => {
  console.log(`Server is running on port ${portNumber}`);
  connectDB()
});