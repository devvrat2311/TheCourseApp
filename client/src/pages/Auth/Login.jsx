import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInUser } from "../../utils/auth";
import { useFlash } from "../../contexts/FlashContext";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";
import ClickyBtn from "../../components/ClickyBtn";
import { jwtDecode } from "jwt-decode";
import LogoutBtn from "../../components/LogoutBtn";
import { CircleUser } from "lucide-react";

function Login() {
    // const [email, setEmail] = useState("");
    const emailRef = useRef();
    // const [password, setPassword] = useState("");
    const passwordRef = useRef();
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInName, setLoggedInName] = useState("");
    const [loggedInRole, setLoggedInRole] = useState("");
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    console.log("rendering login page");

    useEffect(() => {
        const checkLoggedIn = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return;
            }
            try {
                const response = await fetch(`/api/v1/auth/check-logged-in`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refreshToken: localStorage.getItem("refreshToken"),
                    }),
                });
                const data = await response.json();
                console.log(data);
                setIsLoggedIn(data.loggedIn);
                if (isLoggedIn) {
                    const decodedToken = jwtDecode(
                        localStorage.getItem("accessToken"),
                    );
                    setLoggedInName(decodedToken.userFullName);
                    setLoggedInRole(decodedToken.role);
                } else {
                    setLoggedInName("");
                    setLoggedInRole("");
                }
            } catch (err) {
                console.log(err);
                showFlash(err, "error");
            }
        };
        checkLoggedIn();
    }, [isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const emailData = emailRef.current.value;
        const passwordData = passwordRef.current.value;
        try {
            const result = await signInUser({
                email: emailData,
                password: passwordData,
            });
            if (result.type === "Unverified") {
                showFlash(result.message, "error");
                navigate(`/not-verified?userId=${result.userId}`);
            } else {
                //store token in localstorage
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken);

                //redirect to respective dashboard
                if (result.userRole === "student") {
                    showFlash(`Welcome to your account`, "info");
                    navigate("/student/dashboard");
                } else if (result.userRole === "instructor") {
                    showFlash(`Welcome to your account`, "info");
                    navigate("/instructor");
                }
            }
        } catch (err) {
            showFlash(`Error: ${err.message}`, "error");
        }
    };

    if (isLoggedIn) {
        return (
            <div className="text-left border-2 p-4 border-[var(--border)] rounded-xl">
                <div className="p-2 rounded-xl bg-[var(--bg-secondary)]">
                    <p>You're already logged in as </p>
                    <p className="font-bold text-xl">{loggedInName}</p>
                </div>
                <div className="flex gap-2 mt-2 justify-between">
                    <Link to={`/${loggedInRole}`}>
                        <button className="duration-200 transition-all text-xs cursor-pointer hover:bg-[var(--bg-secondary)] rounded-[5px] py-2 px-1 ">
                            <div className="flex gap-2 font-semibold items-center">
                                <CircleUser size={"16px"} />
                                <p>Go to Account</p>
                            </div>
                        </button>
                    </Link>
                    <LogoutBtn onLogout={() => setIsLoggedIn(false)} />
                </div>
            </div>
        );
    }

    return (
        <>
            <Logo stylingClass={"logo-navbar"} />
            <div className="login-container-wrapper">
                <div className="login-container bg-[var(--bg-dark)] border-[var(--shadow-dark)] flex flex-col">
                    <h2 className="text-3xl font-bold text-left mb-2">Login</h2>
                    <form
                        className="flex flex-col"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="email"
                        >
                            EMAIL
                        </label>
                        <input
                            id="email"
                            className="input-class p-2"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            // value={email}
                            // onChange={(e) => setEmail(e.target.value)}
                            ref={emailRef}
                            required
                        />

                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="password"
                        >
                            PASSWORD
                        </label>
                        <input
                            id="password"
                            className="input-class p-2"
                            placeholder="password"
                            name="password"
                            type="password"
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            ref={passwordRef}
                            required
                        />

                        <ClickyBtn
                            buttonType={"submit"}
                            stylingClass={"back-btn center-btn login-btn"}
                        >
                            <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                                <p>Login</p>
                            </div>
                        </ClickyBtn>
                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        <hr className="border-dashed border-t-1 border-[var(--border)] mt-6 mb-3"></hr>
                    </form>
                    <div className="">
                        <Link
                            className="mb-3 block decoration-1 underline text-xs underline-offset-2"
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>
                        <p className="text-xs inline">
                            Don't have an account?{" "}
                        </p>
                        <Link
                            className="text-xs decoration-1 underline underline-offset-2"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </>
    );
}

export default Login;
