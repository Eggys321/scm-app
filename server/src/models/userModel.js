const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: [true, "Email already in use"],
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
      password: {
        type: String,
        trim: true,
        required: [true, "Please enter a password"],
        minlength: [8, "Minimum password length must be 8 chrs"],
        validate(value) {
          if (value.toLowerCase().includes("password")) {
            throw new Error("password mus'nt contain password");
          }
        },
      },
      profilePhoto: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1708852154434-d6436655b99d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEwMnxibzhqUUtUYUUwWXx8ZW58MHx8fHx8",
      },
      bio: {
        type: String,
        default: "I am new here...",
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      friends: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],

      occupation: String,
      location: String,
    },
  },
  { timestamps: true }
);

// hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// password comparison
userSchema.methods.comparePassword = async function (userPassword) {
  const isCorrect = await bcrypt.compare(userPassword, this.password);
  return isCorrect;
};

// generate jwt token
userSchema.methods.generateToken = async function (params) {
  let token = jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRETE
  );
  return token;
};

// generating crypto token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};



const USER = mongoose.model("User", userSchema);
module.exports = USER;