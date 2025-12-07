// components/Navbar.jsx
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
import UserOptions from "./UserOptions";
import { User } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="group flex justify-center items-center">
            <div className="nav-content flex justify-between items-center w-full">
                <div className="nav-logo-links">
                    <Logo stylingClass={"logo-navbar"} />
                    <Navlinks />
                </div>
                <div>
                    {/* <LogoutBtn />*/}
                    <UserOptions />
                </div>
            </div>
        </nav>
    );
}
