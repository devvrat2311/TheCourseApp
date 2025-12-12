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

            const response = await api.post(`/courses/create-course`, formData);
            if (response.ok) {
                showFlash("Course Created", "info");
                navigate("/instructor");
            }
            // const data = await response.json();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="main-content">
            <div>
                <p>Create Course</p>
                <p>Create Course Page YAYYYY</p>
                <form
                    onSubmit={handleSubmit}
                    className="border-1 p-2 flex flex-col gap-2"
                >
                    <label htmlFor="title">title</label>
                    <input
                        type="text"
                        name="title"
                        className="border-1 p-2"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="description">description</label>
                    <input
                        type="text"
                        name="description"
                        className="border-1 p-2"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="border-1 p-2 cursor-pointer"
                    >
                        create +
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateCourse;
