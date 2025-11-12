import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api"; //methods of this api class apply the Authorization header automatically
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackBtn";
import SectionContent from "../../components/SectionContent";
import QuizContent from "../../components/QuizContent";
import CompletedQuizContent from "../../components/CompletedQuizContent";

function CourseSectionPage() {
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

    const handleNextSection = async () => {
        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
            console.log("Next Next Next");
        }, 200);
    };

    const handleMarkComplete = async () => {
        console.log("hello from handleclick in back-btn");
        setIsAnimating(true);
        // Remove animation class after it completes
        try {
            const response = await api.post(
                `/api/v1/courses/${courseId}/${moduleId}/sections/${selectedSectionId}/complete`,
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
        const fetchCourseSection = async () => {
            try {
                const response = await api.get(
                    `/api/v1/courses/${courseId}/${moduleId}/sections/${selectedSectionId}`,
                );

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch section data",
                    );
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
    }, [courseId, moduleId, selectedSectionId]);

    useEffect(() => {
        const fetchAllSections = async () => {
            try {
                const response = await api.get(
                    `/api/v1/courses/${courseId}/${moduleId}`,
                );

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch section data",
                    );
                }
                console.log("All Sections array");
                console.log(data);
                console.log(data.sectionsCompleted);
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

    if (sectionDataLoading || allSectionsLoading)
        return <p>Loading Section. . .</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!sectionData) return <p>No Section Data found</p>;

    const isSectionComplete = (sectionId) => {
        return sectionsCompleted.includes(sectionId);
    };

    return (
        <>
            <Navbar />
            <main>
                <div className="main-content flex border border-[var(--shadow)]">
                    <div className="flex flex-col h-full w-[20vw] border-r-2 border-[var(--shadow)] p-6">
                        <BackButton locationURL={`/courses/${courseId}`} />
                        <h2 className="text-left text-2xl font-semibold mb-[2rem]">
                            Sections
                        </h2>
                        <ul className="text-left">
                            {allSections.map((section, index) => (
                                <li
                                    key={index}
                                    className={`transition duration-150 ease-in-out cursor-pointer p-2 mb-3 ${
                                        selectedSectionId === section._id
                                            ? "selected-index"
                                            : "unselected-index"
                                    }`}
                                    onClick={() => {
                                        setSelectedSectionId(section._id);
                                        navigate(
                                            `/courses/${courseId}/${moduleId}/sections/${section._id}`,
                                        );
                                    }}
                                >
                                    <p className="text-[0.9rem]">
                                        Section {index + 1}
                                    </p>
                                    {isSectionComplete(section._id)
                                        ? "yes"
                                        : "no"}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 text-left flex flex-col">
                        <h2 className="font-semibold text-2xl ml-6 mt-5 h-[4rem]">
                            {sectionData.title}
                        </h2>
                        <div className="relative flex-1">
                            {sectionData.sectionType === "normal" ? (
                                <>
                                    <SectionContent sectionData={sectionData} />
                                    <button
                                        className={`back-btn w-auto absolute bottom-0 left-6 ${isAnimating ? "active" : ""}`}
                                        onClick={
                                            isSelectedSectionComplete
                                                ? handleNextSection
                                                : handleMarkComplete
                                        }
                                    >
                                        {isSelectedSectionComplete
                                            ? "Next"
                                            : "Mark as Complete"}
                                    </button>
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
            </main>
        </>
    );
}

export default CourseSectionPage;
