import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function StudentDashboard() {
    const [ongoingCourses, setOngoingCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("/api/courses/my-courses", {
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
            <Navbar />
            <main className="p-6 border-2 border-blue-900">
                <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

                {/* Ongoing Courses */}
                <section className="mb-10">
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
                                        {item.courseId.sections?.length || 0}
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
                <section>
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
                                    {/* <p className="text-sm text-green-700 mb-2">
                                        Completed on:{" "}
                                        {new Date(
                                            item.completedAt,
                                        ).toLocaleDateString()}
                                    </p> */}
                                    {/* {item.grade && (
                                        <p className="text-sm font-semibold">
                                            Grade: {item.grade}
                                        </p>
                                    )} */}
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
            </main>
        </>
    );
}

export default StudentDashboard;
