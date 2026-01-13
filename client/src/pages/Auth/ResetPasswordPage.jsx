import { useState, useRef } from "react";
import { useFlash } from "../../contexts/FlashContext";
import { useSearchParams, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ClickyBtn from "../../components/ClickyBtn";
import ThemeToggle from "../../components/ThemeToggle";
import Logo from "../../components/Logo";

function ResetPasswordPage() {
    console.log("re-rendering resetpassword page");
    const [searchParams] = useSearchParams();
    const { showFlash } = useFlash();
    const [passwordChanged, setPasswordChanged] = useState(false);

    const passwordRef = useRef();
    const [passwordCheck, setPasswordCheck] = useState("");
    const handleValidation = () => {
        const password = passwordRef.current.value;
        const rePassword = passwordCheck;
        if (password != rePassword) {
            throw new Error("Passwords do not match");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const signedToken = searchParams.get("signature");
        const decodedToken = jwtDecode(signedToken);
        const token = decodedToken.token;
        const userId = decodedToken.userId;

        try {
            handleValidation();
            const res = await fetch(
                `/api/v1/auth/verify-password-token/${token}?userId=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newPassword: passwordRef.current.value,
                    }),
                },
            );
            const data = res.json();
            console.log(data);
            showFlash("Password Changed", "success");
            setPasswordChanged(true);
        } catch (err) {
            showFlash(err.message, "error");
            console.log(err);
        }
    };

    return (
        <>
            <Logo stylingClass={"logo-navbar"} />
            <div className="flex items-center justify-center border-2 p-4 border-[var(--border)] rounded-xl">
                <div className="flex flex-col gap-[20px]">
                    {!passwordChanged ? (
                        <>
                            <p className="text-left">Reset Your Password </p>
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="flex flex-col"
                            >
                                <label
                                    className="text-xs text-left mb-1 mt-3"
                                    htmlFor="newPassword"
                                >
                                    Enter Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    ref={passwordRef}
                                    className="input-class p-2"
                                    required
                                />
                                <label
                                    className="text-xs text-left mb-1 mt-3"
                                    htmlFor="retype-password"
                                >
                                    Enter Password Again
                                </label>
                                <input
                                    type="password"
                                    name="retype-password"
                                    value={passwordCheck}
                                    onChange={(e) =>
                                        setPasswordCheck(e.target.value)
                                    }
                                    className="input-class p-2"
                                    required
                                />

                                <ClickyBtn
                                    stylingClass={
                                        "back-btn center-btn login-btn p-2"
                                    }
                                    type={"submit"}
                                >
                                    <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                                        <p>Set Password</p>
                                    </div>
                                </ClickyBtn>
                            </form>
                        </>
                    ) : (
                        <>
                            <p>Password Changed Successfully!</p>
                            <Link
                                to={"/login"}
                                className="text-xs underline underline-offset-2"
                            >
                                Go to Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <ThemeToggle />
        </>
    );
}

export default ResetPasswordPage;
