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
    //     const newComment = new COMMENT({ userId, text });
    //   await newComment.save();
    const newComment = await COMMENT.create({ userId, text });
    // add comments to posts
    const post = await Post.findById({ _id: postId });
    await Post.findByIdAndUpdate(
      { _id: postId },
      {
        comments: [...post.comments, newComment],
      }
    );
    // console.log(post);

    res.json({ message: "Comment created successfully", text: newComment });
  } catch (error) {
    console.log(error.message);
  }
};
// like a comment
const likeComment = async (req, res) => {
  // try {
  //   const post = await COMMENT.findByIdAndUpdate(
  //     req.params.id,
  //     {
  //       $addToSet: { likes: req.user.userId },
  //     },
  //     { new: true }
  //   );
  //   const posts = await COMMENT.find()
  //     .sort({ createdAt: -1 })
  //     .populate("userId", "userName");
  //   res.status(200).json({
  //     success: true,
  //     message: "comment liked",
  //     post,
  //     posts,
  //   });
  // } catch (error) {
  //   res.status(500).json(error);
  //   console.log(error.message);
  // }
  // // try {
  //   const commentId = req.params.commentId;
  //   const comment = await COMMENT.findById(commentId).populate("userId",'userName');

  //   if (!comment) {
  //     return res.status(404).json({ message: 'Comment not found' });
  //   }

  //   comment.likes += 1;
  //   await comment.save();

  //   res.json({ message: 'Comment liked', comment });
  // } catch (error) {
  //   res.status(500).json({ message: 'Internal server error' });
  //   console.log(error.message);
  // }
};

module.exports = {
  createComment,
  likeComment,
};
