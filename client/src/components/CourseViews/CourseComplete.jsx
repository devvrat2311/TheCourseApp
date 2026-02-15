import Navbar from "../../components/Navbar";
import Logo from "../Logo";

function CourseComplete({ course }) {
    console.log("from courseComplete,", course);
    return (
        <div className="main-content-too">
            {/* <div className="animated-gradient  w-full">*/}
            <div className="animated-gradient-overlay certificate">
                <Logo
                    stylingClass={"logo-constant backdrop-blur-sm w-full"}
                    logoType={"login"}
                />
                <div className="backdrop-blur-sm rounded-[10px] border-2 border-amber-200 p-2">
                    <p
                        id="congratulatory-text"
                        className="text-[2.5rem] text-amber-200 mb-4 font-homemade-apple"
                    >
                        Congratulations {course.userName}!
                    </p>
                    <p
                        id="congratulatory-text"
                        className="text-[2.5rem] text-amber-200 mb-4 font-homemade-apple"
                    >
                        On completing the course{" "}
                        <span className="font-hanken-grotesk font-bold text-[3rem]">
                            {course.title}
                        </span>
                    </p>
                </div>
            </div>
            {/* </div>*/}
        </div>
    );
}
export default CourseComplete;
