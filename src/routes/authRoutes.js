const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authcontroller");  
// NOTE: Capital C in authController

router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
