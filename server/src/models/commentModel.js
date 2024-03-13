const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  date: {
    type: Date,
    default: Date.now,
  },
});

const COMMENT = mongoose.model("Comment", commentSchema);

module.exports = COMMENT;
