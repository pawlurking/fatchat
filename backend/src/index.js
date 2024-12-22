// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';


dotenv.config()

const app = express();
const portNumber = process.env.portNumber;



app.use("/api/auth", authRoutes);

app.listen(portNumber, () => {
  console.log(`Server is running on port ${portNumber}`);
  connectDB()
});