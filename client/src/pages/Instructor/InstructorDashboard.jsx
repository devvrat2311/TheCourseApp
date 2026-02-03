import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { DiamondPlus, House, Pencil, ArrowRight } from "lucide-react";

function InstructorDashboard() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myCourses, setMyCourses] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const response = await api.get("/courses/my-created-courses");
                const data = await response.json();
                setMyCourses(data);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyCourses();
    }, [location]);

    const navigateToNewCoursePage = () => {
        navigate(`/instructor/courses/new`, {
            state: { from: location.pathname },
        });
    };

    const navigateToEditCoursePage = (courseId) => {
        navigate(`/instructor/courses/${courseId}/edit`, {
            state: { from: location.pathname },
        });
    };

    const navigateToPatchCourseInfoPage = (
        courseId,
        courseTitle,
        courseDescription,
    ) => {
        navigate(`/instructor/courses/${courseId}/edit-info`, {
            state: {
                info: {
                    courseTitle,
                    courseDescription,
                },
            },
        });
    };

    if (isLoading) return <p>Loading ...</p>;
    if (error) return <p className="text-red-500 text-xl">Error: {error}</p>;
    if (!myCourses) return <p>No Course Data found for you</p>;
    return (
        <>
            <Outlet />
            <div className="main-content">
                <div className="flex-1 text-left">
                    <h2 className="flex gap-2 items-center text-2xl font-bold ml-5 text-[var(--fg)] ">
                        <House size={24} />
                        Home
                    </h2>
                    <ClickyBtn
                        clickFunction={() => navigateToNewCoursePage()}
                        stylingClass={
                            "back-btn gap-2 px-[1rem] py-[0.4rem] items-center ml-5 mt-5"
                        }
                    >
                        <DiamondPlus
                            className="text-[var(--accent)]"
                            size={22}
                        />
                        Create Course
                    </ClickyBtn>

                    <p className="ml-5 text-xl font-bold text-[var(--accent)] mt-5">
                        My Courses
                    </p>
                    <div className="courses-grid">
                        {myCourses.map((course, index) => (
                            <div key={index} className="courses-grid-item">
                                <p id="courseTitle">{course.title}</p>
                                <p id="courseDesc">{course.description}</p>
                                <p id="courseStudents">
                                    students: {course.enrolledStudents.length}
                                </p>
                                <p id="courseStatus">
                                    status: {course.courseStatus}
                                </p>
                                <div className="flex justify-between">
                                    <ClickyBtn
                                        clickFunction={() =>
                                            navigateToPatchCourseInfoPage(
                                                course._id,
                                                course.title,
                                                course.description,
                                            )
                                        }
                                        stylingClass={
                                            "back-btn gap-2 px-[1rem] py-[0.4rem] items-center mt-5 text-xs"
                                        }
                                    >
                                        <Pencil
                                            className="text-[var(--accent)]"
                                            size={22}
                                        />
                                        Edit Course Info
                                    </ClickyBtn>
                                    <ClickyBtn
                                        clickFunction={() =>
                                            navigateToEditCoursePage(course._id)
                                        }
                                        stylingClass={
                                            "text-xs font-bold back-btn p-[0.8rem] items-center ml-5 mt-3"
                                        }
                                    >
                                        <ArrowRight
                                            className="text-[var(--accent)]"
                                            size={18}
                                            strokeWidth={3}
                                        />
                                    </ClickyBtn>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default InstructorDashboard;
