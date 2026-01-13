import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
// import api from "../../utils/api";
import { useFlash } from "../../contexts/FlashContext";
import ClickyBtn from "../../components/ClickyBtn";
import Loader from "../../components/Loader";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";

function NotVerifiedPage() {
    const { showFlash } = useFlash();
    const [searchParams] = useSearchParams();
    const [emailSending, setEmailSending] = useState(false);
    const userId = searchParams.get("userId");
    console.log("user id is: ", userId);
    const sendEmailVerification = async () => {
        setEmailSending(true);
        try {
            // const response = await api.post(
            //     `/auth/send-verification?userId=${userId}`,
            // );
            const res = await fetch(
                `/api/v1/auth/send-verification?userId=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                showFlash("Verification link sent on Email", "info");
            } else {
                showFlash(data.error);
            }
        } catch (err) {
            console.error("error", err.message);
            showFlash(err.message, "error");
        } finally {
            setEmailSending(false);
        }
    };

    if (emailSending) {
        return <Loader />;
    }
    return (
        <>
            <Logo stylingClass={"logo-navbar"} />
            <div className="login-container-wrapper min-w-screen ">
                <div className="flex gap-2 items-center flex-col login-container">
                    <div className="font-bold">
                        Kindly Verify Your email and login again
                    </div>
                    <div>
                        <ClickyBtn
                            stylingClass="back-btn cursor-pointer border-2 border-[var(--border)] p-2 bg-[var(--bg-secondary)]"
                            clickFunction={sendEmailVerification}
                        >
                            <p className="text-xs">
                                resend email verification link
                            </p>
                        </ClickyBtn>
                    </div>
                    <Link
                        className="text-xs underline underline-offset-3"
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

export default NotVerifiedPage;
