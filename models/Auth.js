const mongoose = require("mongoose");
const crypto = require("crypto");

const authSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        userEmail: {
            type: String,
            required: [true, "Please enter a valid email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },

        //Email Verification
        emailVerificationToken: {
            type: String,
            default: null,
        },
        emailVerificationExpires: {
            type: Date,
            default: null,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationAttempts: {
            type: Number,
            default: 0,
            max: 5, //prevent brute force
        },
        emailVerifiedAt: Date,
        emailVerificationLastSent: Date,

        passwordHash: {
            type: String,
            required: true,
        },

        //Password Reset
        passwordResetToken: {
            type: String,
            default: null,
        },

        passwordResetExpires: {
            type: Date,
            default: null,
        },

        passwordResetAttempts: {
            type: Number,
            default: 0,
            max: 5, //prevent brute force
        },
        passwordResetLastSent: Date,

        refreshTokens: [
            {
                token: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                expiredAt: Date,
                deviceInfo: {
                    userAgent: String,
                    ip: String,
                    device: String,
                },
            },
        ],

        //Security Features
        failedLoginAttempts: {
            type: Number,
            default: 0,
            max: 5,
        },

        lockUntil: {
            type: Date,
            default: null,
        },

        // Account Security
        lastPasswordChange: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);
// authSchema.methods.

authSchema.methods.generatePasswordResetToken = function () {
    // Generate cryptographically secure random token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash and store in database
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 60 * 60 * 1000; //24 hours
    // this.emailVerificationAttempts = 0;
    return verificationToken;
};

authSchema.methods.verifyPasswordToken = function (token) {
    //Check if token is expired
    if (Date.now() > this.passwordResetExpires) {
        return { valid: false, reason: "Token expired" };
    }

    //Check max attemps
    if (this.passwordResetAttempts >= 5) {
        return { valid: false, reason: "Too many attempts" };
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return {
        valid: hashedToken === this.passwordResetToken,
        reason:
            hashedToken === this.passwordResetToken ? "Valid" : "Invalid token",
    };
};

// Method to generate verification token
authSchema.methods.generateEmailVerificationToken = function () {
    // Generate cryptographically secure random token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash and store in database
    this.emailVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; //24 hours
    this.emailVerificationAttempts = 0;
    return verificationToken;
};

authSchema.methods.verifyEmailToken = function (token) {
    //Check if token is expired
    if (Date.now() > this.emailVerificationExpires) {
        return { valid: false, reason: "Token expired" };
    }

    //Check max attemps
    if (this.emailVerificationAttempts >= 5) {
        return { valid: false, reason: "Too many attempts" };
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return {
        valid: hashedToken === this.emailVerificationToken,
        reason:
            hashedToken === this.emailVerificationToken
                ? "Valid"
                : "Invalid token",
    };
};

// Virtual to check if account is locked
authSchema.virtual("isLocked").get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to increment failed login attempts
authSchema.methods.incLoginAttempts = function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { failedLoginAttempts: 1 },
        });
    }

    const updates = { $inc: { failedLoginAttempts: 1 } };

    // Lock account after 5 failed attempts for 2 hours
    if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }

    return this.updateOne(updates);
};

// Method to reset login attempts
authSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
        $unset: { failedLoginAttempts: 1, lockUntil: 1 },
    });
};

module.exports = mongoose.model("Auth", authSchema);
