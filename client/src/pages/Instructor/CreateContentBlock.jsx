import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

function CreateContentBlock() {
    const navigate = useNavigate();
    const [contentFormat, setContentFormat] = useState("paragraph");
    const [formData, setFormData] = useState({});
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
                        rows={3}
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
                    />
                );

            case "image":
                return (
                    <div className="image-fields">
                        <input
                            type="url"
                            placeholder="Image URL"
                            value={formData.url || ""}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    url: e.target.value,
                                });
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Alt text"
                            value={formData.alt || ""}
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
                    <>
                        <textarea
                            value={formData.code || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    code: e.target.value,
                                })
                            }
                            placeholder="Paste your code here"
                            rows={6}
                        />
                        <input
                            type="text"
                            placeholder="Language (js, python, etc."
                            value={formData.language || ""}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    language: e.target.value,
                                });
                            }}
                        />
                    </>
                );

            case "latex":
                return (
                    <textarea
                        placeholder="Enter LaTeX expression"
                        value={formData.expression || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                expression: e.target.value,
                            })
                        }
                        rows={3}
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
        <div className="main-content">
            <div className="flex-1 text-left">
                <form onSubmit={handleSubmit} className="block-form">
                    <div className="form-header">
                        <select
                            value={contentFormat}
                            onChange={(e) => {
                                setContentFormat(e.target.value);
                                setFormData({});
                            }}
                        >
                            <option
                                value="heading"
                                className="bg-[var(--border)]"
                            >
                                Heading
                            </option>
                            <option
                                value="subheading"
                                className="bg-[var(--border)]"
                            >
                                Subheading
                            </option>
                            <option
                                value="paragraph"
                                className="bg-[var(--border)]"
                            >
                                Paragraph
                            </option>
                            <option
                                value="bullet"
                                className="bg-[var(--border)]"
                            >
                                Bullet
                            </option>
                            <option
                                value="image"
                                className="bg-[var(--border)]"
                            >
                                Image
                            </option>
                            <option
                                value="video"
                                className="bg-[var(--border)]"
                            >
                                Video
                            </option>
                            <option value="code" className="bg-[var(--border)]">
                                Code Block
                            </option>
                            <option
                                value="latex"
                                className="bg-[var(--border)]"
                            >
                                LaTeX
                            </option>
                        </select>
                    </div>
                    <div className="form-body">{renderFields()}</div>

                    <button type="submit" className="border-1 p-2">
                        Add Content Block
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateContentBlock;
