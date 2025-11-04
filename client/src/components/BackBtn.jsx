import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function BackButton() {
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        console.log("hello from handleclick in back-btn");
        setIsAnimating(true);
        // Remove animation class after it completes
        setTimeout(() => {
            setIsAnimating(false);
            navigate(-1);
        }, 200);
    };

    return (
        <button
            className={`back-btn flex w-fit pr-[30px] ${isAnimating ? "active" : ""}`}
            onClick={handleClick}
        >
            <ChevronLeft />
            Go Back
        </button>
    );
}

export default BackButton;
