// pages/ExploreCourses.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import api from "../../utils/api";

function ExploreCourses() {
    const [courses, setCourses] = useState([]);
    console.log("rendering explore page", courses);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get("/api/v1/courses", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, []);

    return (
        <>
            <div className="main-content p-6 flex-col">
                <h2 className="text-2xl font-bold mb-4 text-left">
                    Explore Courses
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course) => (
                        <li
                            key={course._id}
                            className="border p-4 rounded shadow"
                        >
                            <h2 className="text-lg font-semibold">
                                {course.title}
                            </h2>
                            <p className="text-sm text-shadow-white">
                                {course.description}
                            </p>
                            <Link to={`/courses/${course._id}`}>
                                Go to Course →
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default ExploreCourses;
