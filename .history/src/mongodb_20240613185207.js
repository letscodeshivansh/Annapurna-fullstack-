const mongoose = require("mongoose");

// Retrieve MongoDB connection URI from environment variable
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Annapurna";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure username is unique
  },
  password: {
    type: String,
    required: true
  }
});

const foodSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true // Ensure price is required
    },
    images: [{
      type: String, // Assuming that we will store image URLs as strings
    }],
    feeder: {
      type: String,
      required: true
    }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
const Food = mongoose.model('Food', foodSchema);

module.exports = { User, Food };
