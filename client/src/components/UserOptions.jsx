import { User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import LogoutBtn from "./LogoutBtn";
import { Settings } from "lucide-react";

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
            className={`group user-icon-navbar ${userMenuOpen ? "user-icon-open" : "user-icon-closed"}  border-[var(--accent)] bg-[var(--bg)] cursor-pointer`}
        >
            <User
                className={` ${userMenuOpen ? "text-[var(--accent)]" : "text-[var(--border)]"} duration-200 transition-all group-hover:text-[var(--accent)]`}
                size={"28px"}
                onClick={toggleUserMenu}
            />
            <div
                className={`user-menu ${userMenuOpen ? "user-menu-open" : "user-menu-closed"}`}
            >
                <p className="text-left py-1 px-1 mb-2 font-bold">
                    {decodedToken.userFullName}
                </p>
                <div className="flex items-center hover:bg-[var(--bg-secondary)] duration-200 transition-all rounded-[5px] gap-2 text-xs text-left py-2 px-1">
                    <Settings size={"16px"} />
                    <p className="font-semibold">settings</p>
                </div>
                <LogoutBtn />
            </div>
        </div>
    );
}
