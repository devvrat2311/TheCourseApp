import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInUser } from "../../utils/auth";
import { useFlash } from "../../contexts/FlashContext";
import Logo from "../../components/Logo";

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

            //store token in localstorage
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            showFlash("Welcome to your account", "info");
            //redirect to dashboard
            navigate("/dashboard");
        } catch (err) {
            showFlash(`Error: ${err.message}`, "info");
        }
    };

    return (
        <>
            <Logo />
            <div className="login-container bg-[var(--bg-dark)] border-2 border-[var(--shadow-dark)] flex flex-col mt-8">
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
                        className="input-class p-2 border-2 border-gray-400"
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
                        className="input-class p-2 border-2 border-gray-400"
                        placeholder="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        className="login-btn mt-[3rem] cursor-pointer"
                        type="submit"
                    >
                        <span className="font-bold">LOGIN</span>
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <hr className="border-t border-gray-300 my-6"></hr>

                    <div>
                        <p className="inline">Don't have an account? </p>
                        <Link
                            className="inline decoration-1 underline"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;
