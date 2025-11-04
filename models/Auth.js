const mongoose = require("mongoose");

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

        passwordHash: {
            type: String,
            required: true,
        },

        emailVerificationToken: {
            type: String,
            default: null,
        },

        emailVerificationExpires: {
            type: Date,
            default: null,
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
