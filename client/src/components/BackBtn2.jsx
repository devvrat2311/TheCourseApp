import ClickyBtn from "./ClickyBtn";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function BackButton2({ locationURL }) {
    const navigate = useNavigate();
    const clickFunction = () => {
        navigate(locationURL);
    };

    return (
        <ClickyBtn clickFunction={clickFunction} stylingClass={"back-btn"}>
            <ChevronLeft />
            Go Back
        </ClickyBtn>
    );
}

export default BackButton2;
