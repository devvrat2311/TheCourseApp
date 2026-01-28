const express = require("express");
const router = express.Router();
const {
    signUp,
    login,
    logout,
    refreshToken,
    sendVerificationEmailControllerMethod,
    verifyEmail,
    sendPasswordResetMethod,
    resetPasswordForgotten,
    checkLoggedIn,
} = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/check-logged-in", checkLoggedIn);
router.post("/send-verification", sendVerificationEmailControllerMethod);
router.get("/verify-email/:token", verifyEmail);
router.post("/send-password-reset", sendPasswordResetMethod);
router.post("/verify-password-token/:token", resetPasswordForgotten);

module.exports = router;
