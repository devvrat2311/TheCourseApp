import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Outlet } from "react-router-dom";

import CoursePreview from "../../components/CourseViews/CoursePreview";
import CourseOngoing from "../../components/CourseViews/CourseOngoing";
import CourseComplete from "../../components/CourseViews/CourseComplete";

function CoursePage() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/api/v1/courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                const data = await response.json();
                if (!response.ok)
                    throw new Error(data.message || "Failed to fetch course");

                setCourseData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return <p>Loading course...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!courseData) return <p>No course data found</p>;

    switch (courseData.view) {
        case "preview":
            return <CoursePreview course={courseData} />;
        case "ongoing":
            return (
                <>
                    <CourseOngoing course={courseData} />
                </>
            );
        case "completed":
            return <CourseComplete course={courseData} />;
        default:
            return <p>Invalid view type.</p>;
    }
}

export default CoursePage;
