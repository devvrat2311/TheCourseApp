import { useTheme } from "../contexts/ThemeContext";
import tcaLogo from "/tca_logo.svg";
import tcaLogoDark from "/tca_logo_dark.svg";

export default function Logo({ height, width }) {
    const { theme } = useTheme();

    return (
        <img
            className={`tca-logo`}
            style={{ height, width }}
            src={theme === "dark" ? tcaLogoDark : tcaLogo}
            alt="Logo"
        />
    );
}
