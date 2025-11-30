import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import {
    ChevronRight,
    CircleDashed,
    CheckCircle2,
    ChevronDown,
} from "lucide-react";
import BackButton from "../BackBtn";
import BackButton2 from "../BackBtn2";
import { Link, useLocation } from "react-router-dom";

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
}

function CourseOngoing({ course }) {
    const location = useLocation();
    const from = location.state?.from || "/dashboard";
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 1000;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dropdown, setDropdown] = useState(false);

    const toggleDropDown = () => {
        setDropdown(!dropdown);
    };

    const modules = course.modules || [];

    const isModuleComplete = (moduleId) => {
        return course.completedModules.includes(moduleId);
    };

    return (
        <>
            <div className="main-content">
                {isMobile ? (
                    <div className="mobile-dropdown">
                        <div className="mobile-dropdown-topsection ">
                            <BackButton2 locationURL={from} />
                            <div className="mobile-dd-dd">
                                <div
                                    onClick={toggleDropDown}
                                    className="mobile-dd-display cursor-pointer flex justify-between rounded p-[10px] text-xs items-center"
                                >
                                    <p>{modules[selectedIndex].title}</p>
                                    <ChevronDown
                                        className={`transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`}
                                    />
                                </div>
                                <div
                                    className={`dropdown border-2 border-[var(--fg)] rounded ${dropdown ? "dd-active" : "dd-inactive"} `}
                                >
                                    <ul className="text-left">
                                        {modules.map((module, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between bg-[var(--bg)] border-b-1 border-b-[var(--border)] last:border-b-0 text-[0.8rem]"
                                                onClick={() => {
                                                    if (
                                                        index != selectedIndex
                                                    ) {
                                                        setSelectedIndex(index);
                                                        toggleDropDown();
                                                    }
                                                }}
                                            >
                                                <div className="flex gap-2">
                                                    <p>{index + 1}</p>
                                                    <p>{module.title}</p>
                                                </div>
                                                {isModuleComplete(
                                                    module._id,
                                                ) ? (
                                                    <CheckCircle2 className="text-green-500" />
                                                ) : (
                                                    <CircleDashed className="text-gray-400" />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="sidebar-modules">
                        <BackButton2 locationURL={from} />
                        <h2 className="text-left text-xl font-semibold mt-[2rem] mb-[2rem]">
                            Modules
                        </h2>
                        <ul className="text-left">
                            {modules.map((module, index) => (
                                <li
                                    key={index}
                                    className={`border-b-1 border-t-1 first:rounded-t-[10px] first:border-t-2 last:rounded-b-[10px] last:border-b-2 border-2
                                        transition duration-150 ease-in-out cursor-pointer pr-3 pl-3 pt-1 pb-1 flex justify-between gap-2 ${
                                            selectedIndex === index
                                                ? "selected-index"
                                                : "unselected-index"
                                        }`}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <div className="flex gap-2 items-baseline-last">
                                        <p className="text-[0.8rem]">
                                            {index + 1}.
                                        </p>
                                        <p className="text-[0.8rem]">
                                            {module.title}
                                        </p>
                                    </div>
                                    {isModuleComplete(module._id) ? (
                                        <CheckCircle2 className="text-green-500" />
                                    ) : (
                                        <CircleDashed className="text-gray-400" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="modules-content flex-1 text-left">
                    <h2 className="font-bold text-3xl ml-6">
                        {modules[selectedIndex].title}
                    </h2>
                    <p className=" ml-6 mt-5 text-xl">
                        {modules[selectedIndex].description}
                    </p>
                    <p className=" ml-6 mt-5 font-semibold">Sections</p>
                    <ul className="ml-6 mt-2 mr-6">
                        {modules[selectedIndex].sections.map(
                            (section, index) => (
                                <li
                                    key={index}
                                    className="text-xs  first:rounded-t-2xl last:rounded-b-2xl hover:bg-[var(--bg-highlighted)] border border-b-0 last:border-b-1 hover:cursor-pointer transition duration-200 ease-in-out border-[var(--border)]"
                                >
                                    <Link
                                        to={`/courses/${course.id}/${modules[selectedIndex]._id}/sections/${section._id}`}
                                        className="p-[14px] flex h-full w-full"
                                    >
                                        <div className="flex-1">
                                            <span className="mr-[6px]">
                                                {index + 1}.
                                            </span>
                                            {section.title}
                                        </div>
                                        <div className="w-[20px]">
                                            <ChevronRight size={16} />
                                        </div>
                                    </Link>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default CourseOngoing;
