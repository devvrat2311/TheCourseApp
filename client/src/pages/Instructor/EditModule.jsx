import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";

function EditModule() {
    const { courseId, moduleId } = useParams();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [moduleTitle, setModuleTitle] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await api.get(
                    `/courses/${courseId}/modules/${moduleId}/sections`,
                );
                const data = await response.json();
                console.log("sections", data.sections);
                setCourseTitle(data.sectionDetails.courseTitle);
                setModuleTitle(data.sectionDetails.moduleTitle);
                setSections(data.sections);
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, [courseId, moduleId]);

    if (loading) return <p>Loading Sections...</p>;
    if (error) return <p>ERROR: {error}</p>;
    if (!sections) return <p>No sections found for this module</p>;

    return (
        <div className="main-content">
            <div className="flex-1 text-left">
                <div className="flex gap-1 items-baseline">
                    <h2 className="text-xl font-bold text-[var(--border)]">
                        {courseTitle}/
                    </h2>
                    <h3 className="font-bold text-[var(--accent)]">
                        {moduleTitle}
                    </h3>
                </div>

                <div className="rounded border-2 border-[var(--border)] p-3 m-2 h-full">
                    <Link
                        to={`/instructor/courses/${courseId}/modules/${moduleId}/sections/new`}
                        className="border-1 p-1"
                    >
                        Create New Section
                    </Link>
                    <p className="mt-2">Sections: </p>
                    {sections.length === 0
                        ? "No sections found"
                        : sections.map((section, index) => (
                              <div
                                  className="border-1 mt-2 px-2 py-1 rounded w-fit"
                                  key={index}
                              >
                                  {section.title}
                                  <Link
                                      to={`/instructor/courses/${courseId}/modules/${moduleId}/sections/${section._id}/edit`}
                                      className="border-1 p-1 ml-2"
                                  >
                                      Edit Section
                                  </Link>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
}

export default EditModule;
