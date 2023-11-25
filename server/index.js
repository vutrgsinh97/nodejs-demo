require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//routes
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learn-mongodb.bhkqvmh.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("mongo is connected!");
  } catch (error) {
    console.error(error.message);
  }
};

connectDB();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.get("/", (req, res) => res.send("Hello world"));

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
