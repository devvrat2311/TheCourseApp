import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ role, children }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === role) {
            return children;
        } else {
            console.log("from privateRoute: sending to /login");
            return <Navigate to={`/${decodedToken.role}`} replace />;
        }
    } catch (err) {
        console.error("From PrivateRoute", err.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
