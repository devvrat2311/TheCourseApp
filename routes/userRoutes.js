const express = require("express");
const { getAllUsers, createUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.route("/users").get(getAllUsers).post(createUser);
router.route("/users/:id").delete(deleteUser);

module.exports = router;
