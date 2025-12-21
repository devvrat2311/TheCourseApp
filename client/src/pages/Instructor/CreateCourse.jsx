import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { useFlash } from "../../contexts/FlashContext";

function CreateCourse() {
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                title: courseTitle,
                description: courseDescription,
            };

            const response = await api.post(`/courses/create`, formData);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                showFlash("Course Created", "info");
                navigate(`/instructor/courses/${data.courseId}/edit`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="create-course-overlay"
            onClick={() => {
                navigate(`/instructor/courses`);
            }}
        >
            <div
                className="create-course max-h-fit max-w-[350px]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="popup-form-title">Create Course</h2>
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
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            onInput={(e) => {
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
                            value={courseDescription}
                            onChange={(e) =>
                                setCourseDescription(e.target.value)
                            }
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            rows={1}
                            required
                        />
                    </div>

                    <ClickyBtn
                        buttonType={"submit"}
                        stylingClass={"back-btn center-btn login-btn"}
                    >
                        <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                            <p>Create +</p>
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

export default CreateCourse;
