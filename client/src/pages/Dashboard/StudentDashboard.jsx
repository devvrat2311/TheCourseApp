import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import { jwtDecode } from "jwt-decode";

function StudentDashboard() {
    const [ongoingCourses, setOngoingCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const decoded = jwtDecode(accessToken);
    // console.log("rendering this page", decoded.userFullName);
    console.log("ongoingCourses", ongoingCourses);
    console.log("completedCourses", completedCourses);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get("/api/v1/courses/my-courses", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setOngoingCourses(data.enrolledCourses || []);
                    setCompletedCourses(data.completedCourses || []);
                } else {
                    console.error("Failed to fetch courses:", data.message);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error.message);
            }
        };

        fetchCourses();
    }, []);

    return (
        <>
            <div className="main-content flex-col">
                <h2 className=" mb-6 text-left">
                    Welcome back! {decoded.userFullName}
                </h2>

                <h2 className="text-2xl font-bold mb-6 text-left">
                    My Dashboard
                </h2>

                {/* Ongoing Courses */}
                <section className="mb-10 mt-10 text-left">
                    <h2 className="text-xl font-semibold mb-4">
                        Ongoing Courses
                    </h2>
                    {ongoingCourses.length === 0 ? (
                        <p className="text-gray-600">
                            You have not enrolled in any courses yet.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {ongoingCourses.map((item) => (
                                <li
                                    key={item.courseId._id}
                                    className="border p-4 rounded shadow"
                                >
                                    <h3 className="text-lg font-semibold mb-2">
                                        {item.courseId.title}
                                    </h3>
                                    <p className="text-sm mb-2">
                                        {item.courseId.description}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Progress:{" "}
                                        {item.completedSections?.length || 0} /{" "}
                                        {item.courseId.modules.length || 0}
                                    </p>
                                    <Link
                                        to={`/courses/${item.courseId._id}`}
                                        className="text-blue-600 font-medium"
                                    >
                                        Continue Course →
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Completed Courses */}
                <section className="text-left">
                    <h2 className="text-xl font-semibold mb-4">
                        Completed Courses
                    </h2>
                    {completedCourses.length === 0 ? (
                        <p className="text-gray-600">
                            No courses completed yet.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {completedCourses.map((item) => (
                                <li
                                    key={item.courseId._id}
                                    className="border p-4 rounded shadow"
                                >
                                    <h3 className="text-lg font-semibold mb-2">
                                        {item.courseId.title}
                                    </h3>
                                    <p className="text-sm mb-2">
                                        {item.courseId.description}
                                    </p>
                                    <Link
                                        to={`/courses/${item.courseId._id}`}
                                        className="text-green-600 font-medium"
                                    >
                                        View Certificate →
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}

export default StudentDashboard;
