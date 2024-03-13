const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { followFriend, unfollowFriend } = require("../controllers/friendController");

// Post request, C -- for create in CRUD operations
router.post("/follow/:friendId",authMiddleware,followFriend);
// unfollow friend
router.post("/unfollow/:friendId",authMiddleware,unfollowFriend);



module.exports = router