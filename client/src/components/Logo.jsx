import { useTheme } from "../contexts/ThemeContext";
import tcaLogo from "/tca_logo.svg";
import tcaLogoDark from "/tca_logo_dark.svg";

export default function Logo({ stylingClass, logoType }) {
    const { theme } = useTheme();

    return (
        <img
            className={stylingClass}
            // src={tcaLogoDark}
            src={
                logoType !== "login"
                    ? theme === "dark"
                        ? tcaLogoDark
                        : tcaLogo
                    : tcaLogoDark
            }
            alt="Logo"
        />
    );
}
