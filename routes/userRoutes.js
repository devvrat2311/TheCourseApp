const express = require("express");
const verifyToken = require("../middleware/auth");
const {
    getAllUsers,
    createUser,
    deleteUser,
    getUserFullName,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").delete(deleteUser);

module.exports = router;
