import { useState } from "react";

export default function ClickyBtn({
    clickFunction,
    children,
    stylingClass,
    buttonType,
}) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e) => {
        if (e && buttonType === "submit") {
            e.preventDefault();
        }
        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
            if (clickFunction) {
                clickFunction();
            } else if (e && buttonType === "submit") {
                e.target.closest("form")?.requestSubmit();
            }
        }, 200);
    };

    return (
        <button
            className={`${stylingClass} flex w-fit pr-[30px] ${isAnimating ? "active" : ""}`}
            onClick={handleClick}
            type={buttonType}
        >
            {children}
        </button>
    );
}
