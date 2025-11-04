import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function LogoutBtn() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            navigate("/login");
            return;
        }

        try {
            const res = await api.post(
                "/api/v1/auth/logout",
                { refreshToken },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const data = await res.json();
            console.log(data.message || "Logged out");

            //clear access token and refresh token
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            //redirect to login page
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Still clear and redirect to prevent stale session
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/login");
        }
    };

    return (
        <button onClick={handleLogout} className="text-red-600 font-semibold">
            Logout
        </button>
    );
}

export default LogoutBtn;
