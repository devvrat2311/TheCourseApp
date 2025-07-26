// components/Navbar.jsx
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

export default function Navbar() {
    return (
        <nav className="flex justify-between px-6 py-3">
            <div className="text-center font-extrabold text-2xl text-white p-2 rounded-2xl">
                TheCourseApp
            </div>
            <div className="space-x-7">
                <Link to="/explore">Explore Courses</Link>
                <Link to="/">My Courses</Link>
            </div>
            <div>
                <LogoutBtn />
            </div>
        </nav>
    );
}
