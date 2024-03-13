const express = require("express");
const { createPost,likePost, removeLike, getAllPosts } = require("../controllers/postController");
const router = express.Router();
const authMiddleware = require('../middleware/auth')


// Post request, C -- for create in CRUD operations

router.post("/post",authMiddleware,createPost);
router.get("/posts",getAllPosts);

// like a post
router.put('/addlike/post/:id', authMiddleware, likePost);
// remove like
router.put('/removelike/post/:id', authMiddleware, removeLike);



module.exports = router;
