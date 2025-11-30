import Navbar from "../../components/Navbar";

function CourseComplete({ course }) {
    console.log("from courseComplete,", course);
    return (
        <>
            <div className="main-content ">
                <div className="animated-gradient  w-full">
                    <div className="flex-col text-left bg-[var(--bg)] h-full p-6 rounded-[9px]">
                        <p className="text-2xl mb-4">{course.certificate}</p>
                        <p className="">
                            Course Description: {course.description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default CourseComplete;
