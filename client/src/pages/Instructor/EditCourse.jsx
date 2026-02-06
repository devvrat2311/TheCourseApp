import {
    useNavigate,
    useParams,
    Link,
    Outlet,
    useOutletContext,
    useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { DiamondPlus, Pencil, ArrowRight } from "lucide-react";

function EditCourse() {
    const location = useLocation();
    const { courseId } = useParams();
    // const [courseTitle, setCourseTitle] = useState("");
    const { setCourseTitle, setModuleTitle, setSectionTitle, setLocationURL } =
        useOutletContext();
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await api.get(`/courses/${courseId}/modules`);
                const data = await response.json();
                console.log(data);
                setModules(data.modules);
                setCourseTitle(data.courseTitle);
                setModuleTitle("");
                setSectionTitle("");
                setLocationURL(`/instructor/`);
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, [location]);

    if (loading) return <p>Loading Modules...</p>;
    if (error) return <p>ERROR: {error}</p>;
    if (!modules) return <p>No modules found for this course</p>;

    const navigateToNewModulePage = () => {
        navigate(`/instructor/courses/${courseId}/edit/new`, {
            state: { from: location.pathname },
        });
    };

    const navigateToEditModulePage = (moduleId) => {
        navigate(`/instructor/courses/${courseId}/modules/${moduleId}/edit`, {
            state: { from: location.pathname },
        });
    };

    const navigateToPatchModuleInfoPage = (
        moduleId,
        moduleTitle,
        moduleDescription,
        moduleLearningObjective,
    ) => {
        navigate(
            `/instructor/courses/${courseId}/edit/modules/${moduleId}/edit-info`,
            {
                state: {
                    info: {
                        moduleTitle,
                        moduleDescription,
                        moduleLearningObjective,
                    },
                },
            },
        );
    };

    const returnDoubleDigit = (number) => {
        if (number < 10) {
            return "0" + number;
        } else {
            return number;
        }
    };

    return (
        <>
            <Outlet />
            <div className="flex-1 text-left">
                <div className="rounded p-3 m-2">
                    <ClickyBtn
                        clickFunction={() => navigateToNewModulePage()}
                        stylingClass={
                            "back-btn gap-2 px-[1rem] py-[0.4rem] items-center ml-1 mt-5"
                        }
                    >
                        <DiamondPlus
                            className="text-[var(--accent)]"
                            size={22}
                        />
                        Create Module
                    </ClickyBtn>
                    <p className="text-2xl font-bold mt-[20px]">Modules</p>
                    <div className="">
                        {modules.length === 0
                            ? "No modules found"
                            : modules.map((module, index) => (
                                  <div key={index}>
                                      <div className="module-card bg-[var(--bg)] flex flex-col items-baseline justify-between border-2 mt-2 p-3 rounded-xl border-[var(--border)] w-full">
                                          <div className="flex items-start w-full justify-between">
                                              <p className="text-2xl mb-3 font-bold">
                                                  {module.title}
                                              </p>
                                              <p className="text-5xl font-bold text-[var(--border)]">
                                                  {returnDoubleDigit(index + 1)}
                                              </p>
                                          </div>
                                          <p className="">
                                              {module.description}
                                          </p>
                                          <div className="flex items-baseline w-full justify-between">
                                              <ClickyBtn
                                                  clickFunction={() =>
                                                      navigateToPatchModuleInfoPage(
                                                          module._id,
                                                          module.title,
                                                          module.description,
                                                          module.learningObjective,
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
                                                  Edit Module Info
                                              </ClickyBtn>
                                              <ClickyBtn
                                                  clickFunction={() =>
                                                      navigateToEditModulePage(
                                                          module._id,
                                                      )
                                                  }
                                                  stylingClass={
                                                      "back-btn text-xs gap-2 px-[1rem] py-[0.4rem] items-center ml-1 mt-5"
                                                  }
                                              >
                                                  <ArrowRight
                                                      className="text-[var(--accent)]"
                                                      size={22}
                                                      strokeWidth={3}
                                                  />
                                              </ClickyBtn>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditCourse;
