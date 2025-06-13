import Navbar from "../../components/Navbar";

function CourseComplete({ course }) {
    return (
        <>
            <Navbar />
            <main>
                <div>Congratulation for Completing the {course.title}</div>
            </main>
        </>
    );
}
export default CourseComplete;
