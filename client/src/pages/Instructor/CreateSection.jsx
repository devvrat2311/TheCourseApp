import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { useFlash } from "../../contexts/FlashContext";

function CreateSection() {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const [sectionTitle, setSectionTitle] = useState("");
    const [sectionType, setSectionType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                title: sectionTitle,
                sectionType: sectionType,
            };
            console.log(formData);

            const response = await api.post(
                `/courses/${courseId}/modules/${moduleId}/sections/create`,
                formData,
            );
            const data = await response.json();
            console.log("showing data", data);
            const newSectionId = data.sectionId;
            if (response.ok) {
                showFlash("Section Created!", "info");
                navigate(
                    `/instructor/courses/${courseId}/modules/${moduleId}/sections/${newSectionId}/edit`,
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="main-content">
            <div className="flex-1 text-left>">
                <div className="rounded border-2 border-[var(--border)] p-3 m-2 w-fit">
                    <h2>List of things to get done</h2>
                    <ol className="list-decimal list-inside text-left">
                        <li className="">New Section Form</li>
                        <li className="">Redirect to Edit Section</li>
                    </ol>
                </div>

                <div>
                    <p className="text-left mb-2">Create Section</p>
                    <form
                        onSubmit={handleSubmit}
                        className="w-fit flex flex-col gap-2"
                    >
                        <label htmlFor="title">title</label>
                        <input
                            type="text"
                            name="title"
                            className="border-1 p-2"
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-center gap-2 p-4 border-2 border-[var(--accent)]">
                            <input
                                type="radio"
                                id="normal"
                                name="sectionType"
                                className="border-1 p-2"
                                value="normal"
                                onChange={(e) => setSectionType(e.target.value)}
                                required
                            />
                            <label htmlFor="normal">normal</label>

                            <input
                                type="radio"
                                id="quiz"
                                name="sectionType"
                                className="border-1 p-2"
                                value="quiz"
                                onChange={(e) => setSectionType(e.target.value)}
                                required
                            />
                            <label htmlFor="quiz">quiz</label>
                        </div>
                        <button
                            type="submit"
                            className="border-1 p-2 cursor-pointer"
                        >
                            create section
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateSection;
