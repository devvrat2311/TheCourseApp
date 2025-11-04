import Navbar from "../Navbar";
import api from "../../utils/api";
import BackButton from "../BackBtn";
import { useFlash } from "../../contexts/FlashContext";
import { useNavigate } from "react-router-dom";

function CoursePreview({ course }) {
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const handleEnroll = async () => {
        try {
            const res = await api.post(`/api/v1/courses/${course.id}/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            showFlash("Enrolled Successfully!", "info");
            navigate("/");
        } catch (err) {
            console.error(err);
            showFlash(`Error: ${err.message}`, "info");
        }
    };
    return (
        <>
            <Navbar />
            <main>
                <div className="main-content flex flex-col">
                    <BackButton />
                    <div className="flex flex-col h-full w-full m-3 p-2">
                        <h2 className="text-3xl font-bold text-left mt-2 mb-2">
                            {course.title}
                        </h2>
                        <p className="text-left mt-2 mb-2 font-semibold">
                            {course.description}
                        </p>
                        <div>
                            <p className="text-left mt-6 mb-2">
                                Things you'll learn in this course
                            </p>
                        </div>
                        <div className="module-info text-left text-xl h-[30vh] mt-2 mb-2 border-2 border-[var(--shadow)] p-3 flex flex-col justify-center items-center">
                            Modules and module wise breakdown of topics here
                        </div>
                        <button
                            onClick={handleEnroll}
                            className="login-btn max-w-3xs cursor-pointer mt-[2rem]"
                        >
                            Enroll
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CoursePreview;
