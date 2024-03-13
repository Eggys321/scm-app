const COMMENT = require("../models/commentModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");

// Post ftn, C -- for create in CRUD operations

const createComment = async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;
  const { text } = req.body;
  try {
    if (!text) {
      res.json({ message: "text is required" });
      return;
    }
    const newComment = await COMMENT.create({ userId, text });
    // add comments to posts
    const post = await Post.findById({ _id: postId });
    await Post.findByIdAndUpdate(
      { _id: postId },
      {
        comments: [...post.comments, newComment],
      }
    );

    res.json({ message: "Comment created successfully", text: newComment });
  } catch (error) {
    console.log(error.message);
  }
};
// like a comment
const likeComment = async (req, res) => {
  try {
    const comment = await COMMENT.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user.userId },
      },
      { new: true }
    );
    const comments = await COMMENT.find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "comment liked",
      comment,
      comments,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error.message);
  }
};

// remove like

const unLikeComment = async (req, res) => {
  try {
    const comment = await COMMENT.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user.userId },
      },
      { new: true }
    );
    const posts = await COMMENT.find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "comment unliked",
      comment,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

module.exports = {
  createComment,
  likeComment,
  unLikeComment
};
