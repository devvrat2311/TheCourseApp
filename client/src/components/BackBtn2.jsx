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
            stylingClass={"back-btn px-[1em] py-[0.2em] gap-2 font-bold"}
        >
            <ChevronLeft size={20} strokeWidth={3} />
            <span className="text-xs font-firacode">back</span>
        </ClickyBtn>
    );
}

export default BackButton2;
