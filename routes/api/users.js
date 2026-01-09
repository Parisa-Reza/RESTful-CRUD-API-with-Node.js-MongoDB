const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken= require('../../middleware/auth.js')
const User = require("../../models/User");

// Create a new user

router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const userObj = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: hashPassword,
    };

    const user = new User(userObj);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// login user (type)

router.post("/login", async (req, res) => {
  try {
    const { type, email, password } = req.body;
    if (type === "email") {
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({ message: "user not found" });
      } else {
        const isValidPassword = await bcrypt.compare(password, user.password); // compares database password with entered password
        if (!isValidPassword) {
          res.status(401).json({ message: "unable to login" });
        } else {
          const accessToken = jwt.sign(
            {
              email: user.email,
              _id: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1d',
            }
          );

          const refreshToken = jwt.sign(
            {
              email: user.email,
              _id: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '3d',
            }
          );
          const userObj = user.toJSON();
          userObj['accessToken']=accessToken;
          userObj['refreshToken']=refreshToken;
          res.json(userObj);
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get all users

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
});


// get user profile

router.get("/profile",authenticateToken, async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById({ _id: id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});


// get one user by ID

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById({ _id: id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});


// update a user by ID

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userBody = req.body;
    const newUpadteUser = await User.findByIdAndUpdate(id, userBody, {
      new: true,
    }); // new:true return the updated document
    if (newUpadteUser) {
      res.json(newUpadteUser);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// delete a user by ID

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUser = await User.findByIdAndDelete({ _id: id });
    if (deleteUser) {
      res.json({ message: "user deleted successfully" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;

//server.js -> routes/api/users.js -> models/User.js
