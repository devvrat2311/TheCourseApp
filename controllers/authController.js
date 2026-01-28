const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Auth = require("../models/Auth");
require("dotenv").config();
// const {
//     sendVerificationEmail,
//     sendResetPasswordLink,
// } = require("../services/emailService");
const {
    sendVerificationEmail,
    sendResetPasswordLink,
} = require("../services/mailgunEmailService");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// const resetPassword = async (req, res) => {
//     console.log("from resetPassword controller method", req.body);
//     try {
//         const
//     }

// }

const sendPasswordResetMethod = async (req, res) => {
    console.log("from sendPasswordResetMethod", req.body);
    try {
        const userAuthRecord = await Auth.findOne({
            userEmail: req.body.email,
        });
        if (!userAuthRecord) {
            /*
            for security, regardless of whether the email exists or not, the system
            should display a message stating that an email has been sent.
            This prevents attackers from determining if an email address is valid.
            */
            return res.json({
                success: true,
                message: "Reset Password Email sent",
                type: "success",
            });
            /*
            Following section of code is development, when you actually want the realise the
            errors and not reduce the attack surface
            */
            // return res.status(401).json({
            //     message: "Invalid User, Auth does not exist for this user",
            //     type: "error",
            // });
        }

        console.log(
            "password reset last sent",
            userAuthRecord.passwordResetLastSent,
        );
        const lastSent = userAuthRecord.passwordResetLastSent || 0;
        const attempts = userAuthRecord.passwordResetAttempts;
        if (Date.now() - lastSent < 3600000 && attempts >= 3) {
            //1 hour
            const minutesLeft = Math.ceil(
                (3600000 - (Date.now() - lastSent)) / 60000,
            );
            return res.status(429).json({
                success: false,
                message: `Please wait ${minutesLeft} minutes before requesting another password reset email`,
                type: "error",
            });
        }

        await sendResetPasswordLink(userAuthRecord);
        userAuthRecord.passwordResetAttempts = attempts + 1;
        userAuthRecord.passwordResetLastSent = Date.now();
        await userAuthRecord.save();

        res.json({
            success: true,
            message: "Reset Password Email sent",
            type: "success",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const resetPasswordForgotten = async (req, res) => {
    try {
        const { token } = req.params;
        const { userId } = req.query;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Invalid Verification Link",
            });
        }

        const authRecord = await Auth.findOne({
            userId: userId,
        });

        if (!authRecord) {
            return res.status(404).json({
                message: "User Auth data not found",
            });
        }

        const validation = authRecord.verifyPasswordToken(token);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.reason,
            });
        }

        // const hashedPassword
        const passwordHash = await bcrypt.hash(newPassword, 10);
        console.log(passwordHash);
        authRecord.passwordHash = passwordHash;
        authRecord.passwordResetToken = undefined;
        authRecord.passwordResetExpires = undefined;
        authRecord.passwordResetAttempts = 0;
        const result = await authRecord.save();
        console.log(result);

        res.json({
            success: true,
            message: "Password Token Validated and password changed",
            user: {
                id: authRecord.userId,
                email: authRecord.userEmail,
                newPassword: newPassword,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            extra: "from error control",
        });
    }
};
const sendVerificationEmailControllerMethod = async (req, res) => {
    try {
        const userAuthRecord = await Auth.findOne({
            userId: req.query.userId,
        });
        if (!userAuthRecord) {
            return res.status(401).json({
                message: "Invalid User, Auth does not exist for this user",
            });
        }
        if (userAuthRecord.emailVerified) {
            return res.status(400).json({
                success: false,
                error: "Email already verified",
            });
        }

        //Check rate limiting (max 3 attempts per hour)
        const lastSent = userAuthRecord.emailVerificationLastSent || 0;
        const attempts = userAuthRecord.emailVerificationAttempts;
        console.log("attempts", attempts);
        if (Date.now() - lastSent < 3600000 && attempts >= 3) {
            //1 hour
            const minutesLeft = Math.ceil(
                (3600000 - (Date.now() - lastSent)) / 60000,
            );
            return res.status(429).json({
                success: false,
                error: `Please wait ${minutesLeft} minutes before requesting another verification email`,
            });
        }

        await sendVerificationEmail(userAuthRecord);
        userAuthRecord.emailVerificationAttempts = attempts + 1;
        userAuthRecord.emailVerificationLastSent = Date.now();
        const newUserAuthRecord = await userAuthRecord.save();
        // console.log("saved");
        // console.log(newUserAuthRecord.emailVerificationAttempts);

        res.json({
            success: true,
            message: "Verification Email sent",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const { userId } = req.query;

        if (!token || !userId) {
            return res.status(401).json({
                success: false,
                error: "Invalid Verification Link",
            });
        }

        const userAuthRecord = await Auth.findOne({
            userId: userId,
        });
        console.log("hiiiiii", userAuthRecord.userId);

        if (!userAuthRecord) {
            return res.status(404).json({
                message: "User Auth data not found",
            });
        }

        if (userAuthRecord.emailVerified) {
            return res.status(400).json({
                success: false,
                error: "Email already verified",
            });
        }

        // Validate this token
        const validation = userAuthRecord.verifyEmailToken(token);

        if (!validation.valid) {
            userAuthRecord.emailVerificationAttempts += 1;
            await userAuthRecord.save();

            return res.status(400).json({
                success: false,
                error: validation.reason,
            });
        }

        //Mark email as verified
        userAuthRecord.emailVerified = true;
        userAuthRecord.emailVerifiedAt = Date.now();
        userAuthRecord.emailVerificationToken = undefined;
        userAuthRecord.emailVerificationExpires = undefined;
        userAuthRecord.emailVerificationAttempts = 0;
        await userAuthRecord.save();

        res.json({
            success: true,
            message: "Email verified successfully",
            user: {
                id: userAuthRecord.userId,
                email: userAuthRecord.userEmail,
                emailVerified: userAuthRecord.emailVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const authDoc = await Auth.findOne({
            "refreshTokens.token": refreshToken,
        });

        if (!authDoc) {
            return res.status(401).json({ message: "Invalid refresh Token" });
        }
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh Token Expired" });
        }

        //verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        const auth = await Auth.findOne({ userId: decoded.userId });
        if (!auth) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const tokenRecord = auth.refreshTokens.find(
            (t) => t.token === refreshToken,
        );
        if (!tokenRecord || tokenRecord.expiredAt < new Date()) {
            return res
                .status(401)
                .json({ error: "Invalid or expired refresh token" });
        }

        //Generate new access token
        const user = await User.findById(decoded.userId);
        const newAccessToken = jwt.sign(
            {
                userId: user._id,
                userFullName: user.fullName,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "1h" },
        );
        const newRefreshToken = jwt.sign(
            {
                userId: user._id,
            },
            JWT_REFRESH_SECRET,
            { expiresIn: "7d" },
        );

        //remove old token -> "refreshToken" from Auths, add "newRefreshToken" to Auths
        authDoc.refreshTokens = authDoc.refreshTokens.filter(
            (rt) => rt.token !== refreshToken,
        );

        authDoc.refreshTokens.push({
            token: newRefreshToken,
            deviceInfo: {
                userAgent: req.get("User-Agent"),
                ip: req.ip,
                device: "browser",
            },
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await authDoc.save();

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        res.status(401).json({ error: "Invalid refresh token" });
    }
};

const logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log("From logout controller method:", refreshToken);

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    try {
        const authDoc = await Auth.findOne({
            "refreshTokens.token": refreshToken,
        });

        if (!authDoc) {
            return res.status(404).json({ message: "Token not found" });
        }

        authDoc.refreshTokens = authDoc.refreshTokens.filter(
            //removes the refreshToken for this session from the array
            (rt) => rt.token !== refreshToken,
        );

        await authDoc.save();
        // console.log("From logout controller method authDoc.save():", resp);

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const checkLoggedIn = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log("From checkLoggedIn controller method:", refreshToken);

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    try {
        const authDoc = await Auth.findOne({
            "refreshTokens.token": refreshToken,
        });

        if (!authDoc) {
            return res.status(200).json({
                loggedIn: false,
                message: "User not logged in",
            });
        } else {
            res.status(200).json({
                loggedIn: true,
                message: "User is logged in",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobile, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: "Email already in use" });

        const newUser = await new User({
            firstName,
            lastName,
            email,
            mobile,
            role,
        }).save();
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(
            "signUp",
            firstName,
            lastName,
            email,
            passwordHash,
            `(${password})`,
            mobile,
        );

        const authRecord = new Auth({
            userId: newUser._id,
            passwordHash,
            userEmail: newUser.email,
            emailVerified: false,
        });
        await authRecord.save();

        await sendVerificationEmail(authRecord).catch((error) => {
            console.error("Failed to send verification email: ", error);
        });
        authRecord.emailVerificationAttempts += 1;
        authRecord.emailVerificationLastSent = Date.now();
        await authRecord.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ error: "Invalid Credentials" });
        const userRole = user.role;
        const auth = await Auth.findOne({ userId: user._id });
        if (!auth)
            return res.status(401).json({ error: "Auth Data not found" });

        if (auth.isLocked)
            return res
                .status(403)
                .json({ error: "Account is temporarily locked" });

        if (!auth.emailVerified) {
            return res.status(200).json({
                success: true,
                message: "Email not verified",
                type: "Unverified",
                userId: auth.userId,
            });
        }

        const isMatch = await bcrypt.compare(password, auth.passwordHash);
        if (!isMatch) {
            await auth.incLoginAttempts();
            return res
                .status(401)
                .json({ error: "Email or Password is Incorrect" });
        }

        await auth.resetLoginAttempts();

        const accessToken = jwt.sign(
            {
                userId: user._id,
                userFullName: user.fullName,
                role: user.role,
                emailVerified: auth.emailVerified,
            },
            JWT_SECRET,
            { expiresIn: "1h" },
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            JWT_REFRESH_SECRET,
            { expiresIn: "7d" },
        );

        auth.refreshTokens.push({
            token: refreshToken,
            deviceInfo: {
                userAgent: req.get("User-Agent"),
                ip: req.ip,
                device: "browser",
            },
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await auth.save();

        res.status(200).json({
            success: true,
            message: "logged in successfully",
            type: "Verified",
            accessToken,
            refreshToken,
            userRole,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    refreshToken,
    signUp,
    login,
    logout,
    sendVerificationEmailControllerMethod,
    verifyEmail,
    sendPasswordResetMethod,
    resetPasswordForgotten,
    checkLoggedIn,
};
