// pages/ExploreCourses.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

function ExploreCourses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch("/api/courses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setCourses(data))
            .catch((err) => console.error("Error fetching courses:", err));
    }, []);

    return (
        <>
            <Navbar />
            <main className="p-6 border-2 border-blue-900">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Explore Courses</h1>
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
            </main>
        </>
    );
}

export default ExploreCourses;
