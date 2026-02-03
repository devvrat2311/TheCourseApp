import {
    useLocation,
    useParams,
    useNavigate,
    Link,
    Outlet,
    useOutletContext,
} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { DiamondPlus, Pencil, ArrowRight } from "lucide-react";

function EditModule() {
    const location = useLocation();
    const { courseId, moduleId } = useParams();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState(null);
    const [error, setError] = useState(null);
    const { setCourseTitle, setModuleTitle, setSectionTitle, setLocationURL } =
        useOutletContext();
    const navigate = useNavigate();

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
                setSectionTitle("");
                setSections(data.sections);
                setLocationURL(`/instructor/courses/${courseId}/edit`);
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, [location]);

    if (loading) return <p>Loading Sections...</p>;
    if (error) return <p>ERROR: {error}</p>;
    if (!sections) return <p>No sections found for this module</p>;

    const navigateToNewSectionPage = () => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/edit/new`,
            {
                state: { from: location.pathname },
            },
        );
    };

    const navigateToEditSectionPage = (sectionId) => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit`,
            {
                state: { from: location.pathname },
            },
        );
    };

    const navigateToPatchSectionTitlePage = (sectionId, sectionTitle) => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/edit/sections/${sectionId}/edit-info`,
            {
                state: {
                    info: {
                        sectionTitle,
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
            <div className="text-left">
                <div className="rounded p-3 m-2">
                    <ClickyBtn
                        clickFunction={() => navigateToNewSectionPage()}
                        stylingClass={
                            "back-btn gap-2 px-[1rem] py-[0.4rem] items-center ml-1 mt-5"
                        }
                    >
                        <DiamondPlus
                            className="text-[var(--accent)]"
                            size={22}
                        />
                        Create Section
                    </ClickyBtn>
                    <p className="text-2xl font-bold mt-[20px]">Sections</p>
                    <div className="scrollable-list">
                        {sections.length === 0
                            ? "No sections found"
                            : sections.map((section, index) => (
                                  <div key={index}>
                                      <div className="flex items-center justify-between border-2 mt-2 p-2 gap-2 rounded-xl border-[var(--border)]">
                                          <div className="flex items-center gap-2">
                                              <button
                                                  onClick={() => {
                                                      navigateToPatchSectionTitlePage(
                                                          section._id,
                                                          section.title,
                                                      );
                                                  }}
                                              >
                                                  <Pencil
                                                      className="text-[var(--accent)]"
                                                      size={22}
                                                  />
                                              </button>
                                              <p className="text-[18px] font-bold text-[var(--border)]">
                                                  {returnDoubleDigit(index + 1)}
                                              </p>
                                              <p className="text-[18px] font-bold">
                                                  {section.title}
                                              </p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <ClickyBtn
                                                  clickFunction={() =>
                                                      navigateToEditSectionPage(
                                                          section._id,
                                                      )
                                                  }
                                                  stylingClass={
                                                      "back-btn text-xs gap-2 px-[1rem] py-[0.4rem] items-center"
                                                  }
                                              >
                                                  <ArrowRight
                                                      className="text-[var(--accent)]"
                                                      size={18}
                                                      strokeWidth={4}
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

export default EditModule;
