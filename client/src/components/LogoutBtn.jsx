import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { LogOut } from "lucide-react";
import ClickyBtn from "./ClickyBtn";

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

    // return (
    //     <button
    //         onClick={handleLogout}
    //         className="border-2 p-1 border-[var(--fg-faded)] text-xs font-bold text-[var(--fg-faded)] cursor-pointer transition duration-200 ease-in-out group-hover:text-red-400 group-hover:border-red-400"
    //     >
    //         <div className="flex gap-2 items-center">
    //             <p>LOGOUT</p>
    //             <LogOut />
    //         </div>
    //     </button>
    // );

    return (
        <ClickyBtn clickFunction={handleLogout} stylingClass={"logout-btn"}>
            <div className="flex gap-2 items-center">
                <p>LOGOUT</p>
                <LogOut size={"16px"} />
            </div>
        </ClickyBtn>
    );
}

export default LogoutBtn;
