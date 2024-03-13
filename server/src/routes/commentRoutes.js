const express = require("express");
const router = express.Router();
const { createComment, likeComment, unLikeComment } = require('../controllers/commentController')
const authMiddleware = require('../middleware/auth');

// Post request, C -- for create in CRUD operations
router.post("/comment/post/:postId",authMiddleware,createComment);
// like a comment
router.put('/addlike/comment/:id', authMiddleware, likeComment);

// remove like
router.put('/unlike/comment/:id', authMiddleware, unLikeComment);
module.exports = router
