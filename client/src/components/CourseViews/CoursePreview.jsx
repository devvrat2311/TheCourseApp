import Navbar from "../../components/Navbar";
import api from "../../utils/api";

function CoursePreview({ course }) {
    const handleEnroll = async () => {
        try {
            const res = await api.post(`/courses/${course.id}/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);
            alert("Enrolled Successully");

            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };
    return (
        <>
            <Navbar />
            <main>
                <div>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                    <button
                        onClick={handleEnroll}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Enroll
                    </button>
                </div>
            </main>
        </>
    );
}

export default CoursePreview;
