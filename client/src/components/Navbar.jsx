// components/Navbar.jsx
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <nav className="group flex justify-center items-center">
            <div className="nav-content flex justify-between items-center w-full">
                <div className="flex justify-center items-center gap-[3rem]">
                    {/* <div className="text-center font-extrabold text-2xl text-[var(--fg)] p-2 pl-0 rounded-2xl">
                        TheCourseApp
                    </div>*/}
                    <Logo width={"20rem"} padding={"2px"} />
                    <div className="space-x-7 text-[0.8rem]">
                        <Link
                            className="transition duration-200 text-[var(--fg-faded)] underline underline-offset-4 decoration-transparent hover:decoration-[var(--fg)] group-hover:text-[var(--fg)]"
                            to="/explore"
                        >
                            Explore
                        </Link>
                        <Link
                            className="transition duration-200 text-[var(--fg-faded)] underline underline-offset-4 decoration-transparent hover:decoration-[var(--fg)] group-hover:text-[var(--fg)]"
                            to="/"
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
