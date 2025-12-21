import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function DropDownList({ contentFormat, setContentFormat, setFormData }) {
    const [dropDown, setDropDown] = useState(false);
    const toggleDropDown = () => {
        setDropDown(!dropDown);
    };
    const ddRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ddRef.current && !ddRef.current.contains(event.target)) {
                setDropDown(false);
            }
        };

        if (dropDown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropDown]);

    const options = [
        { value: "heading", label: "Heading" },
        { value: "subheading", label: "Subheading" },
        { value: "paragraph", label: "Paragraph" },
        { value: "bullet", label: "Bullet" },
        { value: "image", label: "Image (URL)" },
        { value: "video", label: "Video (URL)" },
        { value: "code", label: "Code Block" },
        { value: "latex", label: "LaTeX" },
    ];

    const handleSelect = (value) => {
        setContentFormat(value);
        setFormData({});
        setDropDown(false); // Close after selection
    };

    return (
        <>
            <p className="mb-1">Choose Type: </p>
            <div ref={ddRef} className="relative w-full">
                {/* Selected value display (like the select button) */}
                <button
                    type="button"
                    onClick={toggleDropDown}
                    className="border-2 border-[var(--accent)] w-full px-2 py-2 bg-[var(--bg-secondary)] text-left rounded-xl flex justify-between items-center"
                >
                    <span>
                        {options.find((opt) => opt.value === contentFormat)
                            ?.label || "Select..."}
                    </span>
                    <span
                        className={`transition-transform ${dropDown ? "rotate-180" : ""}`}
                    >
                        <ChevronDown />
                    </span>
                </button>

                {/* Dropdown options */}
                <div
                    className={`transition-all duration-200 ${dropDown ? "dd-active" : "dd-inactive"} absolute top-full left-0 w-full bg-[var(--bg)] rounded-xl rounded-r-none border-2 border-[var(--border)] z-10 max-h-[600px] overflow-y-auto`}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`transition-colors duration-75 ease-out px-4 py-2 cursor-pointer hover:text-[var(--bg)] hover:bg-[var(--accent)] ${
                                contentFormat === option.value
                                    ? "bg-[var(--bg-secondary)]"
                                    : ""
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default DropDownList;
