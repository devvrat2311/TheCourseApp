const ROLES = require("../constants/roles");

const verifyStudent = (req, res, next) => {
    console.log("verify Student called");
    if (req.user.role === ROLES.STUDENT) {
        console.log("verify Student passed");
        next();
    } else {
        return res
            .status(403)
            .json({ message: "This Route is meant for Role Student" });
    }
};

const verifyInstructor = (req, res, next) => {
    console.log("verify Instructor called");
    if (req.user.role === ROLES.INSTRUCTOR) {
        console.log("verify Instructor passed");
        next();
    } else {
        return res
            .status(403)
            .json({ message: "This Route is meant for Role Instructor" });
    }
};

const verifyAdmin = (req, res, next) => {
    console.log("verify Admin called");
    if (req.user.role === ROLES.ADMIN) {
        console.log("verify Admin passed");
        next();
    } else {
        return res
            .status(403)
            .json({ message: "This Route is meant for Role Admin" });
    }
};

module.exports = { verifyStudent, verifyInstructor, verifyAdmin };
