import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const signedToken = searchParams.get("signature");
        const decodedToken = jwtDecode(signedToken);
        // const token = searchParams.get("token");
        const token = decodedToken.token;
        // const userId = searchParams.get("id");
        const userId = decodedToken.userId;

        console.log("Verification link params:", { token, userId });

        //validate we have required params
        if (!token || !userId) {
            setStatus("error");
            setMessage(
                "Invalid verification link. Please use the link in your email",
            );
            return;
        }

        verifyEmail(token, userId);
    }, [searchParams]);

    const verifyEmail = async (token, userId) => {
        try {
            setStatus("verifying");

            const res = await fetch(
                `/api/v1/auth/verify-email/${token}?userId=${userId}`,
            );
            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setMessage(
                    "Email verified successfully, redirecting to login...",
                );

                //Redirect after 3 seconds
                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            message: "Email verified! You can now log in.",
                        },
                    });
                }, 3000);
            } else {
                setStatus("error");
                setMessage(data.error || "verification failed");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Network error. Please try again");
            console.log("error", err.message);
        }
    };
    return (
        <>
            <div className="flex items-center justify-center bg-[var(--bg)]">
                <div className="max-w-md w-full p-8 bg-[var(--bg-secondary)] rounded-lg shadow-lg text-center border-2 border-[var(--border)]">
                    {status === "loading" && (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-[var(--fg)]">
                                Loading verification...
                            </p>
                        </>
                    )}

                    {status === "verifying" && (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-[var(--fg)]">
                                Verifying your email...
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                This may take a moment
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-10 w-10 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">
                                Email Verified!
                            </h2>
                            <p className="text-[var(--fg)] mb-6">{message}</p>
                            <div className="text-sm text-[var(--fg)]">
                                <p>Redirecting in 3 seconds...</p>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="mt-4 text-blue-600 hover:text-blue-800 underline"
                                >
                                    Go to login now
                                </button>
                            </div>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-4">
                                <svg
                                    className="h-10 w-10 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">
                                Verification Failed
                            </h2>
                            <p className="text-[var(--fg)] mb-6">{message}</p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Go to Login
                                </button>

                                <button
                                    onClick={() => navigate("/signup")}
                                    className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Sign Up Again
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Troubleshooting:
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>
                                        • Use the exact link from your email
                                    </li>
                                    <li>• Links expire after 24 hours</li>
                                    <li>• Each link can only be used once</li>
                                    <li>• Try signing up again if needed</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;
