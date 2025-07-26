const express = require("express");
const router = express.Router();
const {
    signUp,
    login,
    logout,
    refreshToken,
} = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

module.exports = router;
