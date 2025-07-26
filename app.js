const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

//assign a var to the express() import
const app = express();

//connect to mongoDB
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

//test for react to express api connectivity
app.get("/api/ping", (req, res) => {
    res.json({ msg: "pong" });
});

//experiment
app.use("/api", userRoutes);

//call api routes
app.use("/baseURI/auth", authRoutes);
app.use("/baseURI/courses", courseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example app is running on port ${PORT}`);
});
