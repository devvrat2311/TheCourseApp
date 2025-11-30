import { useTheme } from "../contexts/ThemeContext";
import tcaLogo from "/tca_logo.svg";
import tcaLogoDark from "/tca_logo_dark.svg";

export default function Logo({ stylingClass }) {
    const { theme } = useTheme();

    return (
        <img
            className={stylingClass}
            src={theme === "dark" ? tcaLogoDark : tcaLogo}
            alt="Logo"
        />
    );
}
