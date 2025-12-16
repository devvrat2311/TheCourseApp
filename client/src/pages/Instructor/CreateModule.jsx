import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { useFlash } from "../../contexts/FlashContext";

function CreateCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const [moduleTitle, setModuleTitle] = useState("");
    const [moduleDescription, setModuleDescription] = useState("");
    const [moduleObjective, setModuleObjective] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                title: moduleTitle,
                description: moduleDescription,
                learningObjective: moduleObjective,
            };

            const response = await api.post(
                `/courses/${id}/modules/create`,
                formData,
            );
            const data = await response.json();
            const newModuleId = data.newModuleId;
            if (response.ok) {
                showFlash("Module Created!", "info");
                navigate(
                    `/instructor/courses/${id}/modules/${newModuleId}/edit`,
                );
            }
            // const data = await response.json();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="main-content">
            <div>
                <p>Create Module</p>
                <form
                    onSubmit={handleSubmit}
                    className="border-1 p-2 flex flex-col gap-2"
                >
                    <label htmlFor="title">title</label>
                    <input
                        type="text"
                        name="title"
                        className="border-1 p-2"
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="description">description</label>
                    <input
                        type="text"
                        name="description"
                        className="border-1 p-2"
                        value={moduleDescription}
                        onChange={(e) => setModuleDescription(e.target.value)}
                        required
                    />

                    <label htmlFor="objective">learning objective</label>
                    <input
                        type="text"
                        name="objective"
                        className="border-1 p-2"
                        value={moduleObjective}
                        onChange={(e) => setModuleObjective(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="border-1 p-2 cursor-pointer"
                    >
                        create module
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateCourse;
