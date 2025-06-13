const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedCourses = async () => {
    try {
        // 1. Delete existing courses
        const deletedCourses = await Course.find({});
        const deletedCourseIds = deletedCourses.map((c) => c._id);

        await Course.deleteMany();
        console.log("All courses deleted.");

        // 2. Clean user course references
        await User.updateMany(
            {},
            {
                $pull: {
                    "studentProfile.enrolledCourses": {
                        courseId: { $in: deletedCourseIds },
                    },
                    "studentProfile.completedCourses": {
                        courseId: { $in: deletedCourseIds },
                    },
                },
            },
        );
        console.log("Stale course references removed from users.");

        // 3. Insert new courses
        const courses = [
            {
                title: "Intro to Cybersecurity",
                description:
                    "Understand the basics of digital security, passwords, and networks.",
                author: "Admin",
                sections: [
                    {
                        title: "What is Cybersecurity?",
                        content:
                            "Cybersecurity is the protection of internet-connected systems...",
                        quiz: [
                            {
                                question:
                                    "What does cybersecurity aim to protect?",
                                options: [
                                    "Buildings",
                                    "Software systems",
                                    "Cars",
                                    "Plants",
                                ],
                                correctAnswer: "Software systems",
                            },
                        ],
                    },
                    {
                        title: "Common Threats",
                        content:
                            "Malware, phishing, and social engineering are common threats.",
                        quiz: [
                            {
                                question:
                                    "Which of these is a phishing attempt?",
                                options: [
                                    "A fake email asking for your password",
                                    "A firewall update",
                                    "A software installation",
                                    "A WiFi connection",
                                ],
                                correctAnswer:
                                    "A fake email asking for your password",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Intro to Fullstack with MERN",
                description:
                    "Learn how to build full-stack apps using MongoDB, Express, React, and Node.",
                author: "Admin",
                sections: [
                    {
                        title: "What is Fullstack?",
                        content:
                            "Fullstack development includes frontend and backend logic...",
                        quiz: [
                            {
                                question:
                                    "Which one is not part of the MERN stack?",
                                options: [
                                    "MongoDB",
                                    "Express",
                                    "React",
                                    "Django",
                                ],
                                correctAnswer: "Django",
                            },
                        ],
                    },
                    {
                        title: "React Basics",
                        content:
                            "React helps in building UI components efficiently.",
                    },
                ],
            },
            {
                title: "Intro to Quantum Computing",
                description:
                    "Explore qubits, superposition, and quantum gates.",
                author: "Admin",
                sections: [
                    {
                        title: "Qubits and Superposition",
                        content:
                            "Unlike classical bits, qubits can be 0 and 1 at the same time.",
                        quiz: [
                            {
                                question:
                                    "What makes a qubit different from a classical bit?",
                                options: [
                                    "It stores more power",
                                    "It has superposition",
                                    "It uses more memory",
                                    "It runs faster",
                                ],
                                correctAnswer: "It has superposition",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Intro to Number Theory",
                description:
                    "Dive into primes, divisibility, and modular arithmetic.",
                author: "Admin",
                sections: [
                    {
                        title: "Prime Numbers",
                        content:
                            "A prime number is only divisible by 1 and itself.",
                        quiz: [
                            {
                                question: "Which of these is a prime number?",
                                options: ["4", "9", "13", "20"],
                                correctAnswer: "13",
                            },
                        ],
                    },
                ],
            },
        ];

        await Course.insertMany(courses);
        console.log("New courses seeded successfully.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedCourses();
