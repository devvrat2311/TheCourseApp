import ClickyBtn from "../../components/ClickyBtn";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";
// import api from "../../utils/api";
import { useFlash } from "../../contexts/FlashContext";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

function ForgotPasswordPage() {
    const { showFlash } = useFlash();
    const emailRef = useRef();
    const [emailSending, setEmailSending] = useState(false);
    const sendVerificationMail = async (e) => {
        e.preventDefault();
        setEmailSending(true);
        try {
            const userEmail = emailRef.current.value;
            console.log(
                "from try block in sendpPasswordResetMethod",
                userEmail,
            );
            // const response = await api.post(`/auth/send-password-reset`, {
            //     email: userEmail,
            // });

            const res = await fetch("/api/v1/auth/send-password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                }),
            });
            const data = await res.json();
            showFlash(data.message, data.type);
        } catch (err) {
            console.log(err.message);
            showFlash(err.message, "error");
        } finally {
            setEmailSending(false);
        }
    };
    if (emailSending) {
        return (
            <>
                <Loader />
            </>
        );
    }
    return (
        <>
            <Logo stylingClass={"logo-navbar"} />
            <div className="login-container-wrapper">
                <div className="login-container flex gap-2 flex-col">
                    <p className="text-left text-xl">Forgot password?</p>
                    <p className="max-w-[300px] font-bold bg-[var(--bg-secondary)] p-2 rounded text-left text-xs wrap-break-word">
                        Submit your email below to recieve an email with a
                        password reset link
                    </p>

                    <form
                        onSubmit={sendVerificationMail}
                        className="pt-2 flex flex-col gap-2"
                    >
                        <label
                            htmlFor="userEmail"
                            className="text-xs text-left mb-1 mt-3"
                        >
                            Email
                        </label>
                        <input
                            name="userEmail"
                            type="email"
                            className="input-class p-2"
                            ref={emailRef}
                            placeholder="email"
                            required
                        />
                        <ClickyBtn
                            stylingClass={"back-btn center-btn"}
                            buttonType={"submit"}
                        >
                            <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                                <p>Send Password Reset Mail</p>
                            </div>
                        </ClickyBtn>
                    </form>
                    <Link
                        className="mt-4 text-xs underline underline-offset-3"
                        to={"/login"}
                    >
                        &#8592; Back to Login
                    </Link>
                </div>
            </div>
            <ThemeToggle />
        </>
    );
}

export default ForgotPasswordPage;
