import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import DropDownList from "../../components/DropDownList";
import ClickyBtn from "../../components/ClickyBtn";
import { Maximize2, Minimize2 } from "lucide-react";

function CreateContentBlock() {
    const navigate = useNavigate();
    const [contentFormat, setContentFormat] = useState("paragraph");
    const [formData, setFormData] = useState({});
    const [maximize, setMaximize] = useState(false);
    const { courseId, moduleId, sectionId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = { ...formData, type: contentFormat };

            const res = await api.post(
                `/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/content`,
                dataToSend,
            );
            // const res = await api.post("/course/example", dataToSend);

            if (res.ok) {
                setFormData({});
            }

            const data = await res.json();
            console.log("yoooo from createContentBlock", data);
            navigate(
                `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit`,
            );
        } catch (err) {
            console.log("HI error is happen: ", err);
        }
    };
    const toggleMaximize = () => {
        setMaximize(!maximize);
    };
    const renderFields = () => {
        switch (contentFormat) {
            case "heading":
            case "subheading":
            case "paragraph":
                return (
                    <textarea
                        value={formData.text || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, text: e.target.value })
                        }
                        placeholder="Enter Text..."
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                                e.target.scrollHeight + "px";
                        }}
                        rows={1}
                        className="input-class p-2 w-full mb-[20px]"
                    />
                );

            case "bullet":
                return (
                    <textarea
                        value={formData.text || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, text: e.target.value })
                        }
                        placeholder="Enter items, separated by commas"
                        rows={4}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                                e.target.scrollHeight + "px";
                        }}
                        className="input-class p-2 w-full mb-[20px]"
                    />
                );

            case "image":
                return (
                    <div className="image-fields">
                        <input
                            type="url"
                            placeholder="Image URL"
                            value={formData.src || ""}
                            className="input-class p-2 w-full mb-[20px]"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    src: e.target.value,
                                });
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Alt text"
                            value={formData.alt || ""}
                            className="input-class p-2 w-full mb-[20px]"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    alt: e.target.value,
                                });
                            }}
                        />
                    </div>
                );

            case "code":
                return (
                    <div className="mb-[30px]">
                        <textarea
                            value={formData.code || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    code: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Tab") {
                                    e.preventDefault();
                                    const start = e.target.selectionStart;
                                    const end = e.target.selectionEnd;
                                    const value = e.target.value;

                                    e.target.value =
                                        value.substring(0, start) +
                                        "\t" +
                                        value.substring(end);
                                    e.target.selectionStart =
                                        e.target.selectionEnd = start + 1;

                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    });
                                }
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const start = e.target.selectionStart;
                                    const value = e.target.value;

                                    const lineStart =
                                        value.lastIndexOf("\n", start - 1) + 1;
                                    const currentValue = value.substring(
                                        lineStart,
                                        start,
                                    );

                                    const leadingWhiteSpace =
                                        currentValue.match(/^[\t ]*/)[0];

                                    e.target.value =
                                        value.substring(0, start) +
                                        "\n" +
                                        leadingWhiteSpace +
                                        value.substring(start);

                                    e.target.selectionStart =
                                        e.target.selectionEnd =
                                            start +
                                            1 +
                                            leadingWhiteSpace.length;

                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    });
                                }
                            }}
                            placeholder="Paste your code here"
                            rows={6}
                            className="input-class p-2 w-full mb-[20px]"
                        />
                        <input
                            type="text"
                            placeholder="available languages - javascript, python, cpp, c"
                            value={formData.language || ""}
                            className="input-class p-2 w-full mb-[20px]"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    language: e.target.value,
                                });
                            }}
                        />
                    </div>
                );

            case "latex":
                return (
                    <textarea
                        placeholder="Enter LaTeX expression"
                        value={formData.text || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                text: e.target.value,
                            })
                        }
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                                e.target.scrollHeight + "px";
                        }}
                        rows={3}
                        className="input-class p-2 w-full mb-[20px]"
                    />
                );

            case "video":
                return (
                    <div className="video-fields">
                        <input
                            type="url"
                            placeholder="Video URL"
                            value={formData.url || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    url: e.target.value,
                                })
                            }
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="create-course-overlay"
            onClick={() => {
                navigate(
                    `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit`,
                );
            }}
        >
            <div
                className={`create-course small-fit ${maximize ? "maximize" : ""} relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup-form-title flex justify-between">
                    <p>Create Content Block</p>
                    <button
                        onClick={toggleMaximize}
                        className="text-[var(--fg)] p-2 hover:bg-[var(--bg)] rounded-[10px] cursor-pointer"
                    >
                        {maximize ? (
                            <Minimize2 size={18} />
                        ) : (
                            <Maximize2 size={18} />
                        )}
                    </button>
                </div>
                <div className="flex-1 text-left mt-6">
                    <form
                        onSubmit={handleSubmit}
                        className="h-full flex flex-col"
                    >
                        <div className="flex-1">
                            <div className="form-header">
                                <DropDownList
                                    contentFormat={contentFormat}
                                    setContentFormat={setContentFormat}
                                    setFormData={setFormData}
                                />
                            </div>
                            <div className="form-body mt-[30px]">
                                {renderFields()}
                            </div>
                        </div>
                        <ClickyBtn
                            buttonType={"submit"}
                            stylingClass={"back-btn center-btn mb-2 login-btn"}
                        >
                            <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                                <p>Create +</p>
                            </div>
                        </ClickyBtn>
                    </form>
                    <p className="text-xs text-[var(--border)] font-bold text-center">
                        click outside the form to exit
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateContentBlock;
