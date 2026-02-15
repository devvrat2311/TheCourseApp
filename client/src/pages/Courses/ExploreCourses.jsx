import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";

function ExploreCourses() {
    const [courses, setCourses] = useState([]);
    console.log("rendering explore page", courses);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get("/courses");
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, []);

    const navigateToCourse = (courseId) => {
        navigate(`/student/courses/${courseId}`, {
            state: { from: location.pathname },
        });
    };

    return (
        <>
            <div className="main-content p-6 flex-col">
                <h2 className="text-2xl font-bold mb-4 text-left">
                    Explore Courses
                </h2>
                {/* <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">*/}
                <ul className="explore-courses-grid">
                    {courses.map((course) => (
                        <li
                            key={course._id}
                            className="explore-courses-card shadow"
                        >
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {course.title}
                                </h2>
                                <p className="text-sm text-shadow-white">
                                    {course.description}
                                </p>
                            </div>
                            <div className="justify-items-end">
                                <ClickyBtn
                                    clickFunction={() =>
                                        navigateToCourse(course._id)
                                    }
                                    stylingClass={
                                        "back-btn text-xs gap-2 px-[1rem] py-[0.4rem] items-center"
                                    }
                                >
                                    <p className="font-firacode">
                                        Go to Course
                                    </p>
                                </ClickyBtn>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default ExploreCourses;
