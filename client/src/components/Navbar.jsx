// components/Navbar.jsx
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <nav className="group flex justify-center items-center">
            <div className="nav-content flex justify-between items-center w-full">
                <div className="nav-logo-links">
                    {/* <div className="text-center font-extrabold text-2xl text-[var(--fg)] p-2 pl-0 rounded-2xl">
                        TheCourseApp
                    </div>*/}
                    <Logo stylingClass={"logo-navbar"} />
                    <div className="nav-links space-x-2 ">
                        <Link
                            className="transition duration-200 text-[var(--border)] underline underline-offset-4 decoration-transparent hover:decoration-[var(--fg)] group-hover:text-[var(--fg)]"
                            to="/explore"
                        >
                            Explore
                        </Link>
                        <p className="inline text-[var(--border)] group-hover:text-[var(--fg)] ">&middot;</p>
                        <Link
                            className="transition duration-200 text-[var(--border)] underline underline-offset-4 decoration-transparent hover:decoration-[var(--fg)] group-hover:text-[var(--fg)]"
                            to="/dashboard"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
                <div>
                    <LogoutBtn />
                </div>
            </div>
        </nav>
    );
}
