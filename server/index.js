import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies
app.use(cookieParser());

// Routes
app.use("/api/v1", routes);

// Set the port number from environment variables or default to 5000
const port = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Mongodb connected");

  // Start the server
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});
