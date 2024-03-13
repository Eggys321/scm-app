const USER = require("../models/userModel");
const jwt = require("jsonwebtoken");

// registration

const registration = async (req, res) => {
  try {
    const { userName, email, password, verifyPassword } = req.body;

    if (!userName || !email || !password || !verifyPassword) {
      res.status(400).json({
        success: false,
        message: "username,email,password are required to register!",
      });
      return;
    }

    if (password !== verifyPassword) {
      res.status(400).json({
        success: false,
        message: "password and verify password must be same!",
      });
      return;
    }

    const user = await USER.create({ ...req.body });
    res
      .status(201)
      .json({ success: true, message: "registration successfull", user });
  } catch (error) {
    if (error.code === 11000) {
      res.status(403).json({ success: false, message: "Email already in use" });
      return;
    }
    res.status(500).send(error);
    console.log(error.message);
  }
};

// login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "all fields are required to login" });
      return;
    }
    // finding a registered email address and password

    const user = await USER.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "wrong credentials" });
      return;
    }
    // comparing password and validating password
    const auth = await user.comparePassword(password);

    if (!auth) {
      res.status(404).json({ success: false, message: "wrong credentials" });
      return;
    }

    // token
    const token = await user.generateToken();
    if (token) {
      res.status(201).json({
        success: true,
        message: "logged in",
        user: {
          userName: user.userName,
          email: user.email,
          token,
        },
      });
      return;
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// logout ftn
const logout = async (req, res) => {
  res.status(200).json({ token: "", message: "logged out successfully" });
};

// get username
const getUserName = async (req, res) => {
  const { userId } = req.user;
  const user = await USER.findOne({ _id: userId });
  res.status(200).json({ success: true, userName: user.userName });
};
// isLoggedIn ftn

const isLoggedIn = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json(false);
    }
    jwt.verify(token, process.env.JWT_SECRETE);
    res.json(true);
  } catch (error) {
    console.log(error.message);
    res.json(false);
  }
};
// get user profile
const getUserProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await USER.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).send(error);
    console.log(error.message);
  }
};

// update user profile
const updateUserProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await USER.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }
    const userProfile = await USER.findOneAndUpdate({
      _id:userId},
    req.body,
    {
      new:true,
      runValidators:true
    }
    )
    res.status(200).json({success:true,userProfile,message:"task updated successfully"})
  } catch (error) {
    res.status(500).send(error);
    console.log(error.message);
  }
};

// forgot password ftn

// reset password ftn

module.exports = {
  registration,
  login,
  getUserName,
  isLoggedIn,
  logout,
  getUserProfile,
  updateUserProfile
};
