const User = require("../models/User");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "could not fetch users" });
    }
};

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if( !deletedUser ) {
            return res.status(404).json({error: "User not found"});
        }

        res.json({ message: "User deleted successfully", deletedUser });
        
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

module.exports = { getAllUsers, createUser, deleteUser };
