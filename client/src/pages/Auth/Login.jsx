import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInUser } from "../../utils/auth";
import { useFlash } from "../../contexts/FlashContext";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";
import ClickyBtn from "../../components/ClickyBtn";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { showFlash } = useFlash();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const result = await signInUser({ email, password });
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
