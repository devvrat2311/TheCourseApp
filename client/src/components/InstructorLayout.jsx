import { Outlet } from "react-router-dom";
import InstructorNavbar from "./InstructorNavbar";

function InstructorLayout() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });
    };
    scrollToTop();
    return (
        <>
            <InstructorNavbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default InstructorLayout;
