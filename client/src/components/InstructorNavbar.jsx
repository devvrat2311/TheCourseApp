import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
import UserOptions from "./UserOptions";
import { User } from "lucide-react";

export default function InstructorNavbar() {
    return (
        <nav className="flex justify-center items-center">
            <div className="nav-content flex justify-between items-center w-full">
                <div className="nav-logo-links">
                    <Logo stylingClass={"logo-navbar"} />
                    {/* <Navlinks />*/}
                </div>
                <div>
                    <UserOptions />
                </div>
            </div>
        </nav>
    );
}
