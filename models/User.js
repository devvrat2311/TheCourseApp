const mongoose = require("mongoose");

const opts = { toJSON: { virtuals: true }, timestamps: true };
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        mobile: {
            type: String,
            required: [true, "Mobile number is requried"],
            unique: true,
            trim: true,
            match: [
                /^[6-9]\d{9}$/,
                "Please enter a valid 10-digit mobile number",
            ],
        },
        role: {
            type: String,
            enum: {
                values: ["student", "instructor", "admin"],
                message: "Role must be student, teacher or admin",
            },
            required: true,
            default: "student",
        },
        //Profile Information
        profilePicture: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"],
            trim: true,
        },
        //Role-specific Information
        teacherProfile: {
            qualification: {
                type: String,
                maxlength: [200, "Qualification cannot exceed 200 characters"],
            },
            experience: {
                type: Number,
                min: [0, "Experience cannot be negative"],
            },
            expertise: [
                {
                    type: String,
                    trim: true,
                },
            ],
        },
        studentProfile: {
            enrolledCourses: [
                {
                    courseId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Course",
                    },
                    enrolledAt: {
                        type: Date,
                        default: Date.now,
                    },
                    completedModules: {
                        type: [mongoose.Schema.Types.ObjectId],
                        default: [],
                    },
                    completedSections: {
                        type: [
                            {
                                moduleId: mongoose.Schema.Types.ObjectId,
                                sectionIds: [mongoose.Schema.Types.ObjectId],
                                isCompleted: {
                                    type: Boolean,
                                    default: false,
                                },
                            },
                        ],
                        default: [],
                    },
                    quizScores: {
                        type: [
                            {
                                moduleId: mongoose.Schema.Types.ObjectId,
                                sectionId: mongoose.Schema.Types.ObjectId,
                                score: Number,
                                maxMarks: Number,
                            },
                        ],
                        default: [],
                    },
                    status: {
                        type: String,
                        enum: ["enrolled", "completed", "dropped"],
                        default: "enrolled",
                    },
                },
            ],
            completedCourses: [
                {
                    courseId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Course",
                    },
                    completedAt: Date,
                    certificateUrl: String,
                    grade: {
                        type: String,
                        enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F"],
                    },
                },
            ],
        },
    },
    opts,
);

UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
