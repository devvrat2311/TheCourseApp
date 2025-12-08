import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Navlinks() {
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const linksRef = useRef({});

    const links = [
        { to: "/explore", label: "Explore" },
        { to: "/dashboard", label: "Dashboard" },
    ];

    useEffect(() => {
        const activeLink = linksRef.current[location.pathname];
        if (activeLink) {
            const { offsetLeft, offsetWidth, offsetHeight, offsetTop } =
                activeLink;
            setIndicatorStyle({
                left: `${offsetLeft - 12}px`,
                width: `${offsetWidth + 24}px`,
                height: `${offsetHeight + 4}px`,
                top: `${offsetTop - 2}px`,
            });
        }
    }, [location.pathname]);

    return (
        <>
            <div className="relative nav-links flex space-x-8 p-1 h-fit font-bold">
                <div
                    className="absolute bottom-0 bg-[var(--bg)] rounded-full transition-all duration-300 ease-in-out z-0"
                    style={indicatorStyle}
                />
                {links.map(({ to, label }) => (
                    <Link
                        key={to}
                        ref={(el) => (linksRef.current[to] = el)}
                        className={`relative text-[0.9rem] transition duration-200 z-10 ${
                            location.pathname === to
                                ? "text-[var(--accent)]"
                                : "text-[var(--fg-lighter)] hover:text-[var(--accent)]"
                        }`}
                        to={to}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </>
    );
}
