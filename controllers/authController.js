const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Auth = require("../models/Auth");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

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
        });
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
        const userRole = user.role;
        // console.log("logging user", user.firstName, "\n");
        if (!user)
            return res.status(401).json({ error: "Invalid Credentials" });

        const auth = await Auth.findOne({ userId: user._id });
        if (!auth)
            return res.status(401).json({ error: "Auth Data not found" });

        if (auth.isLocked)
            return res
                .status(403)
                .json({ error: "Account is temporarily locked" });

        const isMatch = await bcrypt.compare(password, auth.passwordHash);
        if (!isMatch) {
            await auth.incLoginAttempts();
            return res.status(401).json({ error: "Invaild Credentials" });
        }

        await auth.resetLoginAttempts();

        const accessToken = jwt.sign(
            {
                userId: user._id,
                userFullName: user.fullName,
                role: user.role,
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

        res.json({ accessToken, refreshToken, userRole });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { refreshToken, signUp, login, logout };
