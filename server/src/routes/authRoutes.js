const express = require("express");
const router = express.Router();
const {registration,login, getUserName, isLoggedIn, getUserProfile, updateUserProfile, getUserFriends} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth')

// register route
router.post("/registration",registration)
// login
router.post('/login',login);

// getUserName route
router.get('/getusername',authMiddleware,  getUserName);
// isLoggedIn route
router.get('/isloggedin',isLoggedIn);
// get user profile
router.get('/user/:userId',authMiddleware, getUserProfile);
// get user friends
router.get('/userfriends/:userId',authMiddleware, getUserFriends);
// update request, U -- for update in CRUD operations
router.patch("/user/:userId",authMiddleware,updateUserProfile);

module.exports = router