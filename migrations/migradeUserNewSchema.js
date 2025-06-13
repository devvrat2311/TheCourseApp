// migration/enrollments_migration.js

const mongoose = require("mongoose");
const User = require("../models/User"); // adjust path to your User model

// Connect to your DB
mongoose
    .connect("mongodb://localhost:27017/courses-platform", {})
    .then(async () => {
        console.log("Connected to DB");

        const users = await User.find({
            "studentProfile.enrolledCourses.progress": { $exists: true },
        });

        console.log(`Found ${users.length} users to update`);

        for (const user of users) {
            let updated = false;

            user.studentProfile.enrolledCourses.forEach((course) => {
                course.progress = undefined;
                course.completedSections = [];
                course.quizScores = [];
                updated = true;
            });

            if (updated) {
                await user.save();
                console.log(`Updated user: ${user._id}`);
            }
        }

        console.log("Migration completed");
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("Error during migration:", err);
        mongoose.disconnect();
    });
