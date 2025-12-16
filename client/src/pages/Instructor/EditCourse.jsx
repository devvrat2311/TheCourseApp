import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";

function EditCourse() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await api.get(`/courses/${id}/modules`);
                const data = await response.json();
                console.log(data);
                setModules(data);
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, [id]);

    if (loading) return <p>Loading Modules...</p>;
    if (error) return <p>ERROR: {error}</p>;
    if (!modules) return <p>No modules found for this course</p>;

    return (
        <div className="main-content ">
            <div className="flex-1 text-left">
                <div className="rounded border-2 border-[var(--border)] p-3 m-2 w-fit">
                    <h2>List of things to get done</h2>
                    <ol className="list-decimal list-inside">
                        <li className="line-through">Create Module</li>
                        <li className="line-through">Module List</li>
                        <li className="line-through">Edit Modules Link</li>
                        <li>Rearrange Modules</li>
                    </ol>
                </div>
                <div className="rounded border-2 border-[var(--border)] p-3 m-2 h-full">
                    <Link
                        to={`/instructor/courses/${id}/modules/new`}
                        className="border-1 p-1"
                    >
                        Create New Module
                    </Link>
                    <p className="mt-2">Modules: </p>
                    {modules.length === 0
                        ? "No modules found"
                        : modules.map((module, index) => (
                              <div
                                  className="border-1 mt-2 px-2 py-1 rounded w-fit"
                                  key={index}
                              >
                                  {module.title}
                                  <Link
                                      to={`/instructor/courses/${id}/modules/${module._id}/edit`}
                                      className="border-1 p-1 ml-2"
                                  >
                                      Edit Module
                                  </Link>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
}

export default EditCourse;
