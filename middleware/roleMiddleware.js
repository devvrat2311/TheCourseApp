const ROLES = require("../constants/roles");

const verifyStudent = (req, res, next) => {
    if (req.user.role === ROLES.STUDENT) {
        next();
    } else {
        return res
            .status(403)
            .json({ message: "This page is meant for Role Student" });
    }
};

const verifyInstructor = (req, res, next) => {
    if (req.user.role === ROLES.INSTRUCTOR) {
        next();
    } else {
        return res
            .status(403)
            .json({ message: "This page is meant for Role Instructor" });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user.role === ROLES.ADMIN) {
        next();
    } else {
        return res
            .status(403)
            .json({ message: "This page is meant for Role Admin" });
    }
};

module.exports = { verifyStudent, verifyInstructor, verifyAdmin };
