const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Auth = require("../models/Auth");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    try {
        const authDoc = await Auth.findOne({
            "refreshTokens.token": refreshToken,
        });
        console.log(authDoc);

        if (!authDoc) {
            return res.status(404).json({ message: "Token not found" });
        }

        authDoc.refreshTokens = authDoc.refreshTokens.filter(
            (rt) => rt.token !== refreshToken,
        );

        await authDoc.save();

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
            return res.status(409).json({ error: "Email already in use" });

        const newUser = await new User({
            firstName,
            lastName,
            email,
            mobile,
            role,
        }).save();
        const passwordHash = await bcrypt.hash(password, 10);

        const authRecord = new Auth({ userId: newUser._id, passwordHash });
        await authRecord.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log("logging user \n");
        console.log(user);
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
            return res.status(401).json({ error: "Invaild Credentias" });
        }

        await auth.resetLoginAttempts();

        const accessToken = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "15m" },
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

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.log("I am responsible");
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signUp, login, logout };
