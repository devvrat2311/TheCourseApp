import api from "../../utils/api";
import BackButton2 from "../BackBtn2";
import { useFlash } from "../../contexts/FlashContext";
import { useNavigate, useLocation } from "react-router-dom";
import ClickyBtn from "../ClickyBtn";
import { DiamondPlus } from "lucide-react";

function CoursePreview({ course }) {
    const location = useLocation();
    const from = location.state?.from || "/student/explore";
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const handleEnroll = async () => {
        try {
            const res = await api.post(`/courses/${course.id}/enroll`);

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            showFlash("Enrolled Successfully!", "info");
            navigate("/student");
        } catch (err) {
            console.error(err);
            showFlash(`Error: ${err.message}`, "info");
        }
    };
    return (
        <>
            <div className="main-content flex flex-col">
                <BackButton2 locationURL={from} />
                <div className="flex flex-col h-full w-full m-3 p-2">
                    <h2 className="text-5xl font-bold text-left mt-2 mb-2">
                        {course.title}
                    </h2>
                    <p className="text-left mt-2 mb-2 ">{course.description}</p>
                    <div className="module-info text-left bg-[var(--bg-secondary)] mt-2 mb-2 border-2 border-[var(--border)] rounded-xl p-3 flex flex-col justify-baseline items-baseline">
                        <h2 className="text-xl font-bold text-[var(--accent)] mb-4">
                            Modules in this course and what they will teach you
                        </h2>
                        {course.learningObjectives.map((module, index) => {
                            return (
                                <div key={index}>
                                    <p className="font-semibold">
                                        <span className="mr-2">
                                            {index + 1}
                                        </span>
                                        {module.name}
                                    </p>
                                    <p>{module.learningObjective}</p>
                                </div>
                            );
                        })}
                    </div>
                    <ClickyBtn
                        clickFunction={handleEnroll}
                        stylingClass={
                            "back-btn gap-2 max-w-3s mt-[2rem] px-[2rem] py-[0.5rem]"
                        }
                    >
                        <DiamondPlus className="text-[var(--accent)]" />
                        <p>Enroll</p>
                    </ClickyBtn>
                </div>
            </div>
        </>
    );
}

export default CoursePreview;
