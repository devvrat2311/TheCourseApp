import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFlash } from "../../contexts/FlashContext";
import ThemeToggle from "../../components/ThemeToggle";
import ClickyBtn from "../../components/ClickyBtn";

function SignUp() {
    const navigate = useNavigate();
    const { showFlash } = useFlash();

    console.log(showFlash);
    console.log("Re-Rendered");

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const mobileRef = useRef();
    // const passwordRef = useRef();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent page reload

        try {
            const formData = {
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                email: emailRef.current.value,
                mobile: mobileRef.current.value,
                password,
            };
            if (formData.password !== confirmPassword) {
                throw new Error("Passwords are not matching");
            }
            const res = await fetch("/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = res.json();

            if (res.ok) {
                console.log("response", res.ok);
                showFlash("Signup Successful", "info");
                navigate("/login");
            } else {
                console.log(res);
                showFlash(`error: ${data}`, "info");
            }
        } catch (err) {
            console.error("Error:", err);
            showFlash(`error: ${err}`, "info");
        }
    };

    return (
        <>
            <div className="login-container-wrapper">
                <div className="login-container bg-[var(--bg-dark)] flex flex-col">
                    <h2 className="text-3xl font-bold text-left">Sign Up</h2>
                    <form
                        className="flex flex-col"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="firstName"
                        >
                            FIRST NAME
                        </label>
                        <input
                            className="input-class p-2 border-2 border-gray-400"
                            name="firstName"
                            ref={firstNameRef}
                            required
                        />

                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="lastName"
                        >
                            LAST NAME
                        </label>
                        <input
                            className="input-class p-2 border-2 border-gray-400"
                            name="lastName"
                            ref={lastNameRef}
                            required
                        />

                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="email"
                        >
                            EMAIL
                        </label>
                        <input
                            className="input-class p-2 border-2 border-gray-400"
                            name="email"
                            ref={emailRef}
                            required
                        />

                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="mobile"
                        >
                            PHONE
                        </label>
                        <input
                            className="input-class p-2 border-2 border-gray-400"
                            name="mobile"
                            ref={mobileRef}
                            required
                        />

                        <label
                            className="text-xs text-left mb-1 mt-3"
                            htmlFor="password"
                        >
                            PASSWORD
                        </label>
                        <input
                            className="input-class p-2 border-2 border-gray-400"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                        />

                        <div className="text-left mb-1 mt-3 flex gap-2">
                            <label
                                className="font-semibold text-xs text-left mb-1 mt-3"
                                htmlFor="password"
                            >
                                CONFIRM PASSWORD
                            </label>
                            <label
                                className="text-xs text-left mb-1 mt-3"
                                htmlFor="password"
                            >
                                {password
                                    ? confirmPassword === password
                                        ? "(Passwords match)"
                                        : "(Passwords do not match)"
                                    : ""}
                            </label>
                        </div>
                        <input
                            className={`input-class p-2 border-2 mb-3  ${password != "" ? (confirmPassword === password ? "border-green-400" : "border-red-400") : "border-gray-400"}`}
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            required
                        />

                        <ClickyBtn
                            buttonType={"submit"}
                            stylingClass={"back-btn center-btn login-btn"}
                        >
                            <div
                                className="flex gap-2 items-center px-[3rem] py-[0.4rem]"
                            >
                                <p>Sign Up</p>
                            </div>
                        </ClickyBtn>

                        <hr className="border-t border-gray-300 my-6"></hr>
                    </form>

                    <div>
                        <p className="inline">Already have an account? </p>
                        <Link
                            className="inline decoration-1 underline"
                            to="/login"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
                <ThemeToggle />
            </div>
        </>
    );
}

export default SignUp;
