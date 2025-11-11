import Navbar from "../../components/Navbar";
import { useState } from "react";
// import api from "../../utils/api";
import { ChevronRight, CircleDashed, CheckCircle2 } from "lucide-react";
import BackButton from "../BackBtn";
import { Link } from "react-router-dom";

function CourseOngoing({ course }) {
    console.log("logging course");
    console.log(course);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const modules = course.modules || [];
    console.log(course.modules);
    console.log(course.completedModules);

    const isModuleComplete = (moduleId) => {
        return course.completedModules.includes(moduleId);
    };

    return (
        <>
            <Navbar />
            <main>
                <div className="main-content flex border border-[var(--shadow)]">
                    <div className="flex flex-col h-full w-[20vw] border-r-2 border-[var(--shadow)] p-6">
                        <BackButton locationURL={"/"} />
                        <h2 className="text-left text-2xl font-semibold mb-[2rem]">
                            Modules
                        </h2>
                        <ul className="text-left">
                            {modules.map((module, index) => (
                                <li
                                    key={index}
                                    className={`transition duration-150 ease-in-out cursor-pointer p-2 mb-3 flex justify-between ${
                                        selectedIndex === index
                                            ? "selected-index"
                                            : "unselected-index"
                                    }`}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <p className="text-[0.9rem]">
                                        Module {index + 1}
                                    </p>
                                    {isModuleComplete(module._id) ? (
                                        <CheckCircle2 />
                                    ) : (
                                        <CircleDashed />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 text-left">
                        <h2 className="font-bold text-3xl ml-6 mt-5">
                            {modules[selectedIndex].title}
                        </h2>
                        <p className=" ml-6 mt-5">
                            {modules[selectedIndex].description}
                        </p>
                        <ul className="ml-6 mt-6 mr-6">
                            {modules[selectedIndex].sections.map(
                                (section, index) => (
                                    <li
                                        key={index}
                                        className="text-xs  first:rounded-t-2xl last:rounded-b-2xl hover:bg-[var(--highlighted)] border border-b-0 last:border-b-1 hover:cursor-pointer transition duration-200 ease-in-out border-[var(--highlighted)]"
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
            </main>
        </>
    );
}

export default CourseOngoing;
