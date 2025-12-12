import { Outlet } from "react-router-dom";
import InstructorNavbar from "./InstructorNavbar";

function InstructorLayout() {
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
