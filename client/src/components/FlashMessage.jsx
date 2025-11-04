import { useFlash } from "../contexts/FlashContext";
import { X } from "lucide-react";

function FlashMessage() {
    const { flashMessage, flashType, clearFlash } = useFlash();

    if (!flashMessage) return null;
    return (
        <div className={`flash-message flash-${flashType}`}>
            {flashMessage}
            <button
                className="p-1 font-bold cursor-pointer"
                onClick={clearFlash}
            >
                <X size={14} />
            </button>
        </div>
    );
}

export default FlashMessage;
