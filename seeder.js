// seedCourses.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedCourses = async () => {
    await Course.deleteMany(); // clear existing courses

    const courses = [
        {
            title: "Cryptography and Network Security",
            description:
                "Learn the basics of different protocols and algorithms used in Securing networks and protocols.",
            author: "Debabrata Adhikari",
            modules: [
                {
                    title: "Module 1",
                    description: "CyberSecurity Fundamentals",
                    sections: [
                        //section-1
                        {
                            title: "Cybersecurity Fundamentals",
                            sectionType: "normal",
                            content: [
                                {
                                    type: "heading",
                                    text: "Introduction to Cybersecurity",
                                },
                                {
                                    type: "paragraph",
                                    text: "Cybersecurity is the protection of information that is stored, transmitted,  and processed in a networked system of computers, other digital devices and network devices and transmission lines, including the internet. Protection encompasses confidentiality, integrity, availability, authenticity and accountability. Methods of protection include organizational policies and procedures, as well as technical means such as encryption and secure communications protocols. ",
                                },
                                {
                                    type: "subheading",
                                    text: "As subsets of Cybersecurity, we can define the following",
                                },
                                {
                                    type: "bullet",
                                    text: " Information Security: This term refers to preservation of confidentiality, integrity and availability of information. In addition, other properties, such as authenticity, accountability, nonrepudiation, and reliability can also be involved.",
                                },
                                {
                                    type: "bullet",
                                    text: " Network Security: This term refers to protection of networkds and their service from unauthorized modification, destruction, or disclosure, and provision of assurance that the network performs its critical functions correctly and here are no harmful side effects.",
                                },
                                {
                                    type: "code",
                                    language: "python",
                                    code: `
                                                    import hashlib\n
                                                    password = 'mypassword'\n
                                                    hashed = hashlib.sha256(password.encode()).hexdigest()
                                          `,
                                },
                            ],
                        },
                        //section-2
                        {
                            title: "Security Quiz",
                            sectionType: "quiz",
                            quiz: [
                                {
                                    question:
                                        "What does CIA stand for in cybersecurity?",
                                    options: [
                                        "Confidentiality, Integrity, Availability",
                                        "Central Intelligence Agency",
                                        "Cybersec Intelligance Agency",
                                        "Cyber Indian Agenda",
                                    ],
                                    correctAnswer:
                                        "Confidentiality, Integrity, Availability",
                                },
                                {
                                    question:
                                        "Which is a common type of cyber attack",
                                    options: [
                                        "Phishing",
                                        "Swimming",
                                        "Running",
                                        "Fishing",
                                    ],
                                    correctAnswer: "Phishing",
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "Module 2",
                    description: "CyberSecurity Fundamentals",
                    sections: [
                        //section-1
                        {
                            title: "Cybersecurity Fundamentals",
                            sectionType: "normal",
                            content: [
                                {
                                    type: "heading",
                                    text: "Introduction to Cybersecurity",
                                },
                                {
                                    type: "paragraph",
                                    text: "Cybersecurity is the protection of information that is stored, transmitted,  and processed in a networked system of computers, other digital devices and network devices and transmission lines, including the internet. Protection encompasses confidentiality, integrity, availability, authenticity and accountability. Methods of protection include organizational policies and procedures, as well as technical means such as encryption and secure communications protocols. ",
                                },
                                {
                                    type: "subheading",
                                    text: "As subsets of Cybersecurity, we can define the following",
                                },
                                {
                                    type: "bullet",
                                    text: " Information Security: This term refers to preservation of confidentiality, integrity and availability of information. In addition, other properties, such as authenticity, accountability, nonrepudiation, and reliability can also be involved. ",
                                },
                                {
                                    type: "bullet",
                                    text: " Network Security: This term refers to protection of networkds and their service from unauthorized modification, destruction, or disclosure, and provision of assurance that the network performs its critical functions correctly and here are no harmful side effects. ",
                                },
                                {
                                    type: "code",
                                    language: "python",
                                    code: `
                                                    import hashlib\n
                                                    password = 'mypassword'\n
                                                    hashed = hashlib.sha256(password.encode()).hexdigest()
                                          `,
                                },
                            ],
                        },
                        //section-2
                        {
                            title: "Security Quiz",
                            sectionType: "quiz",
                            quiz: [
                                {
                                    question:
                                        "What does CIA stand for in cybersecurity?",
                                    options: [
                                        "Confidentiality, Integrity, Availability",
                                        "Central Intelligence Agency",
                                        "Cybersec Intelligance Agency",
                                        "Cyber Indian Agenda",
                                    ],
                                    correctAnswer:
                                        "Confidentiality, Integrity, Availability",
                                },
                                {
                                    question:
                                        "Which is a common type of cyber attack",
                                    options: [
                                        "Phishing",
                                        "Swimming",
                                        "Running",
                                        "Fishing",
                                    ],
                                    correctAnswer: "Phishing",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    try {
        await Course.insertMany(courses);
        console.log("Courses seeded successfully.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedCourses();
