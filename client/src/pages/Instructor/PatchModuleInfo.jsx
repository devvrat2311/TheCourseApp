import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFlash } from "../../contexts/FlashContext";
import { useState } from "react";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";

function PatchModuleInfo() {
    const navigate = useNavigate();
    const { courseId, moduleId } = useParams();
    const { showFlash } = useFlash();
    const { info } = useLocation().state;
    const [moduleTitle, setModuleTitle] = useState(info.moduleTitle);
    const [moduleDescription, setModuleDescription] = useState(
        info.moduleDescription,
    );
    const [moduleLearningObjective, setModuleLearningObjective] = useState(
        info.moduleLearningObjective,
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                newTitle: moduleTitle,
                newDescription: moduleDescription,
                newLearningObjective: moduleLearningObjective,
            };

            const response = await api.patch(
                `/courses/${courseId}/modules/${moduleId}`,
                formData,
            );
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                showFlash("Module Edited", "info");
                navigate(`/instructor/courses/${courseId}/edit`);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div
            className="create-course-overlay"
            onClick={() => {
                navigate(`/instructor/courses/${courseId}/edit`);
            }}
        >
            <div
                className="create-course small-fit"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="popup-form-title">Edit Module Info</h2>
                <form
                    onSubmit={handleSubmit}
                    className="p-2 flex flex-col gap-2 text-left mt-[30px]"
                >
                    <div className="flex flex-col">
                        <label
                            htmlFor="title"
                            className="text-xs text-left mb-1 ml-1 mt-3"
                        >
                            title
                        </label>
                        <textarea
                            type="text"
                            name="title"
                            className="input-class p-2"
                            value={moduleTitle}
                            onChange={(e) => setModuleTitle(e.target.value)}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            onFocus={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            rows={1}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="description"
                            className="text-xs text-left mb-1 ml-1 mt-3"
                        >
                            description
                        </label>
                        <textarea
                            name="description"
                            className="input-class p-2"
                            value={moduleDescription}
                            onChange={(e) =>
                                setModuleDescription(e.target.value)
                            }
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            onFocus={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="learning-objective"
                            className="text-xs text-left mb-1 ml-1 mt-3"
                        >
                            description
                        </label>
                        <textarea
                            name="description"
                            className="input-class p-2"
                            value={moduleLearningObjective}
                            onChange={(e) =>
                                setModuleLearningObjective(e.target.value)
                            }
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            onFocus={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            rows={3}
                            required
                        />
                    </div>

                    <ClickyBtn
                        buttonType={"submit"}
                        stylingClass={"back-btn center-btn login-btn"}
                    >
                        <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                            <p>Save</p>
                        </div>
                    </ClickyBtn>
                </form>
                <p className="text-xs text-[var(--border)] font-bold mt-2">
                    click outside the form to exit
                </p>
            </div>
        </div>
    );
}

export default PatchModuleInfo;
