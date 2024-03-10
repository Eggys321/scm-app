const POST = require("../models/postModel");

// Post ftn, C -- for create in CRUD operations
const createPost = async (req, res) => {
  try {
    req.body.user = req.user.userId;

    const { content } = req.body;
    if (!content) {
      res.status(400).json({
        success: false,
        message: "content must be filled to create a post",
      });
      return;
    }

    // const newPost = new POST({user, content });
    // await newPost.save();
    // res.json({ message: 'Post created successfully', post: newPost });

    const newPost = await POST.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "post created successfully", newPost });
  } catch (error) {
    res.status(500).json(error);
    console.log(error.message);
  }
};
// like a post
const likePost = async (req, res) => {
  try {
    const post = await POST.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user.userId },
      },
      { new: true }
    );
    const posts = await POST.find()
      .sort({ createdAt: -1 })
      .populate("user", "userName");
    res.status(200).json({
      success: true,
      message: "post liked",
      post,
      posts,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error.message);
  }
};

// remove like

const removeLike = async (req, res) => {
  try {
    const post = await POST.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user.userId },
      },
      { new: true }
    );
    const posts = await POST.find()
      .sort({ createdAt: -1 })
      .populate("user", "userName");
    res.status(200).json({
      success: true,
      message: "post unliked",
      post,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  likePost,
  removeLike
};
