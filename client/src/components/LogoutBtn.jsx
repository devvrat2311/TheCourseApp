import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { LogOut } from "lucide-react";
import ClickyBtn from "./ClickyBtn";

function LogoutBtn({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (onLogout) {
            onLogout();
        }
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            navigate("/login");
            return;
        }

        try {
            const res = await api.post(
                "/auth/logout",
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
        <>
            <button
                onClick={handleLogout}
                className="duration-200 transition-all text-xs cursor-pointer hover:bg-[var(--bg-secondary)] rounded-[5px] py-2 px-1 "
            >
                <div className="flex gap-2 font-semibold items-center">
                    <LogOut size={"16px"} />
                    <p>logout</p>
                </div>
            </button>
        </>
        // <ClickyBtn clickFunction={handleLogout} stylingClass={"logout-btn"}>
        //     <div className="flex gap-2 items-center">
        //         <p>LOGOUT</p>
        //         <LogOut size={"16px"} />
        //     </div>
        // </ClickyBtn>
    );
}

export default LogoutBtn;
