import ClickyBtn from "./ClickyBtn";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function BackButton2({ locationURL }) {
    const navigate = useNavigate();
    const clickFunction = () => {
        navigate(locationURL);
    };

    return (
        <ClickyBtn
            clickFunction={clickFunction}
            stylingClass={"back-btn px-[1rem] py-[0.2rem] gap-2 font-bold"}
        >
            &#8592;<span className="text-xs">back</span>
        </ClickyBtn>
    );
}

export default BackButton2;
