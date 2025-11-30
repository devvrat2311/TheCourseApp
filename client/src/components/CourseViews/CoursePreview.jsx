import api from "../../utils/api";
import BackButton2 from "../BackBtn2";
import { useFlash } from "../../contexts/FlashContext";
import { useNavigate } from "react-router-dom";
import ClickyBtn from "../ClickyBtn";
import { DiamondPlus } from "lucide-react";

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
            <div className="main-content flex flex-col">
                <BackButton2 locationURL={"/explore"} />
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
                    <div className="module-info text-left text-xl h-[30vh] mt-2 mb-2 border-2 border-[var(--border)] rounded-xl p-3 flex flex-col justify-baseline items-baseline">
                        Modules and module wise breakdown of topics here
                    </div>
                    <ClickyBtn clickFunction={handleEnroll} stylingClass={"back-btn gap-2 max-w-3s mt-[2rem] px-[2rem] py-[0.5rem]"} >
                        <DiamondPlus className="text-[var(--accent)]" />
                        <p>Enroll</p>
                    </ClickyBtn>
                </div>
            </div>
        </>
    );
}

export default CoursePreview;
