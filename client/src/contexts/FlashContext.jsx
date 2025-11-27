import { createContext, useContext, useState } from "react";
const FlashContext = createContext();

export function FlashProvider({ children }) {
    const [flashMessage, setFlashMessage] = useState("");
    const [flashType, setFlashType] = useState("info"); //success, error, info

    const showFlash = (message, type = "info") => {
        console.log("showing flash now");
        setFlashMessage(message);
        setFlashType(type);

        //auto-dismiss after 3 seconds
        setTimeout(() => {
            setFlashMessage("");
        }, 3000);
    };

    const clearFlash = () => {
        setFlashMessage("");
    };

    return (
        <FlashContext.Provider
            value={{ flashMessage, flashType, showFlash, clearFlash }}
        >
            {children}
        </FlashContext.Provider>
    );
}

export function useFlash() {
    return useContext(FlashContext);
}
