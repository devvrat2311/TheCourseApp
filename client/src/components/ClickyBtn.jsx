import { useState } from "react";

export default function ClickyBtn({ clickFunction, children, stylingClass }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
            clickFunction();
        }, 200);
    };

    return (
        <button
            className={`${stylingClass} flex w-fit pr-[30px] ${isAnimating ? "active" : ""}`}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}
