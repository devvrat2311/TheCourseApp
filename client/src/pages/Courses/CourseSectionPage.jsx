import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../utils/api"; //methods of this api class apply the Authorization header automatically
import BackButton2 from "../../components/BackBtn2";
import SectionContent from "../../components/SectionContent";
import QuizContent from "../../components/QuizContent";
import CompletedQuizContent from "../../components/CompletedQuizContent";
import { useFlash } from "../../contexts/FlashContext";
import { CheckCircle2, CircleDashed, ChevronDown } from "lucide-react";

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
}

function CourseSectionPage() {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 1000;
    const { courseId, moduleId, sectionId } = useParams();
    const [sectionDataLoading, setSectionDataLoading] = useState(true);
    const [allSectionsLoading, setAllSectionsLoading] = useState(true);
    const [sectionData, setSectionData] = useState(null);
    const [allSections, setAllSections] = useState(null);
    const [sectionsCompleted, setSectionsCompleted] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(sectionId);
    const [isSelectedSectionComplete, setIsSelectedSectionComplete] =
        useState(false);
    const [error, setError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    // const [nextSectionId, setNextSectionId] = useState(null);
    // const [nextModuleId, setNextModuleId] = useState(null);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleNextSection = async () => {
        setIsAnimating(true);
        // let nextSectionId;
        // let nextModuleId;
        try {
            const response = await api.get(
                `/courses/${courseId}/${moduleId}/sections/${selectedSectionId}/next`,
            );
            const data = await response.json();
            // console.log("data is", data);
            console.log(
                "next section id and module is: ",
                data.nextSectionId,
                data.nextModuleId,
            );
            // nextSectionId = data.nextSectionId?.toString();
            // setNextSectionId(data.nextSectionId);
            // nextModuleId = data.nextModuleId?.toString();
            // setNextModuleId(data.nextModuleId);
            // console.log("these are the next ids", nextSectionId, nextModuleId);

            setTimeout(() => {
                setIsAnimating(false);
                console.log("Next Next Next");
                if (data.nextModuleId && data.nextSectionId) {
                    navigate(
                        `/student/courses/${courseId}/${data.nextModuleId}/sections/${data.nextSectionId}`,
                    );
                    setSelectedSectionId(data.nextSectionId);
                } else {
                    navigate(`/student/courses/${courseId}`);
                    showFlash(
                        "Congratulations! You completed the course",
                        "success",
                    );
                }
            }, 200);
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    };

    const handleMarkComplete = async () => {
        console.log("hello from handleclick in back-btn");
        setIsAnimating(true);
        // Remove animation class after it completes
        try {
            const response = await api.post(
                `/courses/${courseId}/${moduleId}/sections/${selectedSectionId}/complete`,
            );
            if (response.ok) {
                const data = await response.json();
                console.log("Marked Complete successful: ", data);
                setSectionsCompleted(data.completedSections);
            }
        } catch (err) {
            console.log(err);
        }
        setTimeout(() => {
            setIsAnimating(false);
            setIsSelectedSectionComplete(true);
        }, 200);
    };
    useEffect(() => {
        //get current Section
        // console.log("Rendering fetchcoursesection effect");
        const fetchCourseSection = async () => {
            try {
                const response = await api.get(
                    `/courses/${courseId}/${moduleId}/sections/${selectedSectionId}`,
                );

                const data = await response.json();
                console.log("from get section data", data);
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch section data",
                    );
                }
                if (data.courseCompleted) {
                    navigate(`/student/courses/${courseId}/`);
                }
                console.log(`Single Section data for ${selectedSectionId}`);
                console.log(data);

                if (data.sectionData) {
                    setSectionData(data.sectionData);
                } else {
                    setSectionData(data.sanitizedSection);
                }
                setIsSelectedSectionComplete(data.isSectionCompleted);
            } catch (err) {
                setError(err.message);
            } finally {
                setSectionDataLoading(false);
            }
        };
        fetchCourseSection();
    }, [courseId, moduleId, selectedSectionId, isSelectedSectionComplete]);

    useEffect(() => {
        console.log("Rendering setSelectedSectionId effect");
        setSelectedSectionId(sectionId);
        scrollToTop();
    }, [sectionId]);

    useEffect(() => {
        const fetchAllSections = async () => {
            try {
                const response = await api.get(
                    `/courses/${courseId}/${moduleId}`,
                );

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch section data",
                    );
                }
                setAllSections(data.allSections.sections);
                setSectionsCompleted(data.sectionsCompleted);
            } catch (err) {
                console.log("error here");
                setError(err.message);
            } finally {
                setAllSectionsLoading(false);
            }
        };
        fetchAllSections();
    }, [courseId, moduleId]);
    const ddRef = useRef();

    const [dropdown, setDropdown] = useState(false);
    const toggleDropDown = () => {
        // if (dropdown) {
        //     document.html.classList.add("no-scroll");
        // }
        setDropdown(!dropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ddRef.current && !ddRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };

        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown]);
    if (sectionDataLoading || allSectionsLoading)
        return <p>Loading Section. . .</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!sectionData) return <p>No Section Data found</p>;

    const isSectionComplete = (sectionId) => {
        return sectionsCompleted.includes(sectionId);
    };

    return (
        <>
            <div className="main-content">
                {isMobile ? (
                    <div className="mobile-dropdown">
                        <div className="mobile-dropdown-topsection ">
                            {/* flex gap-[1rem] items-center px-6*/}
                            <BackButton2
                                locationURL={`/student/courses/${courseId}`}
                            />
                            <div ref={ddRef} className="mobile-dd-dd">
                                <div
                                    onClick={toggleDropDown}
                                    className="mobile-dd-display cursor-pointer flex justify-between rounded p-[10px] text-xs items-center"
                                >
                                    {
                                        allSections.find(
                                            (section) =>
                                                section._id ===
                                                selectedSectionId,
                                        )?.title
                                    }
                                    <ChevronDown
                                        className={`transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`}
                                    />
                                </div>
                                <div
                                    className={`dropdown ${dropdown ? "dd-active" : "dd-inactive"} `}
                                >
                                    <ul className="text-left">
                                        {allSections.map((section, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between bg-[var(--bg)] border-b-1 border-b-[var(--border)] last:border-b-0 text-[0.8rem]"
                                                onClick={() => {
                                                    if (
                                                        section._id !=
                                                        selectedSectionId
                                                    ) {
                                                        navigate(
                                                            `/student/courses/${courseId}/${moduleId}/sections/${section._id}`,
                                                        );
                                                        toggleDropDown();
                                                    }
                                                }}
                                            >
                                                <div className="flex gap-2">
                                                    <p>{index + 1}.</p>
                                                    <p>{section.title}</p>
                                                </div>
                                                {isSectionComplete(
                                                    section._id,
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
                        <BackButton2
                            locationURL={`/student/courses/${courseId}`}
                        />
                        {/* <h2 className="text-left text-2xl font-semibold mb-[2rem]">*/}
                        <h2 className="text-left text-xl font-semibold mt-[2rem] mb-[2rem]">
                            Sections
                        </h2>
                        <ul className="text-left">
                            {allSections.map((section, index) => (
                                <li
                                    key={index}
                                    className={`border-b-1 border-t-1 first:rounded-t-[10px] first:border-t-2 last:rounded-b-[10px] last:border-b-2 border-2
                                                transition duration-150 ease-in-out cursor-pointer flex justify-between gap-2 ${
                                                    sectionId === section._id
                                                        ? "selected-index"
                                                        : "unselected-index"
                                                }`}
                                    onClick={() => {
                                        navigate(
                                            `/student/courses/${courseId}/${moduleId}/sections/${section._id}`,
                                        );
                                    }}
                                >
                                    <div className="flex flex-1 gap-2 items-baseline-last">
                                        <p className="text-[0.8rem]">
                                            {index + 1}.
                                        </p>
                                        <p className="text-[0.8rem]">
                                            {section.title}
                                        </p>
                                    </div>
                                    <p className="">
                                        {isSectionComplete(section._id) ? (
                                            <CheckCircle2 className="text-green-500" />
                                        ) : (
                                            <CircleDashed className="text-gray-400" />
                                        )}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="section-content flex-1 text-left flex flex-col">
                    <h2 className="font-semibold text-2xl ml-6 mt-5 h-[4rem]">
                        {sectionData.title}
                    </h2>
                    <div className="relative flex-1">
                        {sectionData.sectionType === "normal" ? (
                            <>
                                <SectionContent sectionData={sectionData} />
                                <div className="mt-6 p-4 bg-[var(--border)] rounded-b-2xl">
                                    <button
                                        className={`back-btn w-auto px-[1rem] py-[0.4rem] left-6 ${isAnimating ? "active" : ""}`}
                                        onClick={
                                            isSelectedSectionComplete
                                                ? handleNextSection
                                                : handleMarkComplete
                                        }
                                    >
                                        {isSelectedSectionComplete
                                            ? "Next"
                                            : "Mark Complete"}
                                    </button>
                                </div>
                            </>
                        ) : isSelectedSectionComplete ? (
                            <CompletedQuizContent />
                        ) : (
                            <QuizContent
                                sectionData={sectionData}
                                onQuizComplete={(completedSections) => {
                                    setSectionsCompleted(completedSections);
                                    setIsSelectedSectionComplete(true);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseSectionPage;
