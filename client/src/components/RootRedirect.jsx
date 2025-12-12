import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

function RootRedirect() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.role;

        if (userRole === "student") {
            return <Navigate to="/student" replace />;
        } else if (userRole === "instructor") {
            return <Navigate to="/instructor" replace />;
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return <Navigate to="/login" replace />;
    } catch (err) {
        console.log(err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return <Navigate to="/login" replace />;
    }
}

export default RootRedirect;
