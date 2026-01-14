import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });
    };
    scrollToTop();
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
