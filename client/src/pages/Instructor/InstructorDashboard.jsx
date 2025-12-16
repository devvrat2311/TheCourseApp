import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";

function InstructorDashboard() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myCourses, setMyCourses] = useState(null);

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
    }, []);

    if (isLoading) return <p>Loading ...</p>;
    if (error) return <p className="text-red-500 text-xl">Error: {error}</p>;
    if (!myCourses) return <p>No Course Data found for you</p>;
    return (
        <div className="main-content">
            <div className="flex flex-col border-1 flex-1">
                <h2 className="border-1">Teacher Dashboard</h2>
                <Link className="border-1" to="/instructor/courses/new">
                    Create Course
                </Link>
                <p>My Courses</p>
                {myCourses.map((course, index) => (
                    <div key={index} className="p-2 border-1">
                        <p>{course.title}</p>
                        <p>{course.description}</p>
                        <p>students: {course.enrolledStudents.length}</p>
                        <p>status: {course.courseStatus}</p>
                        <Link
                            className="border-1"
                            to={`/instructor/courses/${course._id}/edit`}
                        >
                            Edit Course
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InstructorDashboard;
