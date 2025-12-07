import { User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import LogoutBtn from "./LogoutBtn";
export default function UserOptions() {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };
    const userMenuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuOpen]);

    return (
        <div
            ref={userMenuRef}
            className={`user-icon-navbar ${userMenuOpen ? "user-icon-open" : "user-icon-closed"}  border-[var(--accent)] bg-[var(--bg)] cursor-pointer`}
        >
            <User
                className="text-[var(--accent)]"
                onClick={toggleUserMenu}
                size={"22px"}
            />
            <div
                className={`user-menu ${userMenuOpen ? "user-menu-open" : "user-menu-closed"}`}
            >
                <p className="text-xs text-left">{decodedToken.userFullName}</p>
                <p className="text-xs text-left">settings</p>
                <LogoutBtn />
            </div>
        </div>
    );
}
