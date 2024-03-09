const express = require("express");
const router = express.Router();
const {registration,login} = require('../controllers/authController');

// register route
router.post("/registration",registration)
// login
router.post('/login',login);

module.exports = router