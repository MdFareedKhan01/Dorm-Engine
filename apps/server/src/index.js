import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("API running...");
});

app.post("/users", async (req, res) => {
  try {
    const { username } = req.body;

    const newUser = new User({ username });
    await newUser.save();

    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));