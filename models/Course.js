const mongoose = require("mongoose");

const sectionContentBlockSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "heading",
                "subheading",
                "paragraph",
                "bullet",
                "image",
                "video",
                "code",
                "latex",
            ],
        },
    },
    {
        discriminatorKey: "type",
        _id: false,
    },
);

const headingSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false },
);

const subheadingSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false },
);

const paragraphSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false },
);

const bulletSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false },
);

const imageSchema = new mongoose.Schema(
    {
        src: { type: String, required: true },
        alt: { type: String },
    },
    { _id: false },
);

const videoSchema = new mongoose.Schema(
    {
        src: { type: String, required: true },
    },
    { _id: false },
);

const codeSchema = new mongoose.Schema(
    {
        language: { type: String, required: true },
        code: { type: String, required: true },
    },
    { _id: false },
);

const latexSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false },
);

sectionContentBlockSchema.discriminator("heading", headingSchema);
sectionContentBlockSchema.discriminator("subheading", subheadingSchema);
sectionContentBlockSchema.discriminator("paragraph", paragraphSchema);
sectionContentBlockSchema.discriminator("bullet", bulletSchema);
sectionContentBlockSchema.discriminator("image", imageSchema);
sectionContentBlockSchema.discriminator("video", videoSchema);
sectionContentBlockSchema.discriminator("code", codeSchema);
sectionContentBlockSchema.discriminator("latex", latexSchema);

const quizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sectionType: {
        type: String,
        required: true,
        enum: ["normal", "quiz"],
    },

    content: [sectionContentBlockSchema],
    quiz: [quizQuestionSchema],
});

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    learningObjective: { type: String },
    sections: [sectionSchema],
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String },
    modules: [moduleSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
