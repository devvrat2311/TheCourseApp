import { Outlet } from "react-router-dom";
import { useState } from "react";
import ClickyBtn from "../../components/ClickyBtn";
import BackButton2 from "../../components/BackBtn2";
import { Menu } from "lucide-react";

function EditCourseLayout() {
    const [courseTitle, setCourseTitle] = useState("");
    const [moduleTitle, setModuleTitle] = useState("");
    const [sectionTitle, setSectionTitle] = useState("");
    const [locationURL, setLocationURL] = useState("");
    return (
        <div className="main-content flex-col p-2">
            <div className="flex items-center">
                <BackButton2 locationURL={locationURL} />
            </div>
            <div className="course-location mt-4 rounded-2xl text-left flex items-baseline gap-1 p-3">
                <p className="font-bold">{courseTitle}/</p>
                {/* {moduleTitle === "" ? "" : "/"}*/}
                <p>{moduleTitle}/</p>
                {/* {sectionTitle === "" ? "" : "/"}*/}
                <p>{sectionTitle}/</p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-[10px] flex-1 mb-[50px]">
                <Outlet
                    context={{
                        setCourseTitle,
                        setModuleTitle,
                        setSectionTitle,
                        setLocationURL,
                    }}
                />
            </div>
        </div>
    );
}

export default EditCourseLayout;
