const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
    question: { type: String, requried: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    quiz: [quizQuestionSchema],
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String },
    sections: [sectionSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
