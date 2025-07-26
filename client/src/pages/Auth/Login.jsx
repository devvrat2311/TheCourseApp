import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../utils/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signInUser({ email, password });

            //store token in localstorage
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);

            //redirect to dashboard
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center rounded-2xl p-7">
            <h2 className="text-3xl font-bold ">Sign In</h2>
            <div className="p-10 border-2 border-mainblue-400 rounded-2xl mt-3">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label className="text-xs text-left mb-1" for="username">
                        email
                    </label>
                    <input
                        id="username"
                        className="input-field"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="text-xs text-left mb-1" for="password">
                        password
                    </label>
                    <input
                        id="password"
                        className="input-field"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="mt-3" type="submit">
                        Login
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <button
                        className="mt-3"
                        onClick={() => {
                            navigate("/signup");
                        }}
                        type="button"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
