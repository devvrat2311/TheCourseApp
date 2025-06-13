import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        role: "student",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent page reload

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = res.json();

            if (res.ok) {
                alert("Signup Successful!");
                navigate("/login");
            } else {
                alert("Signup Failed: " + data.error);
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occured");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center rounded-2xl p-7">
            <h2 className="text-3xl font-bold ">Sign Up</h2>
            <p>Please fill the following details to register</p>
            <div className="p-10 border-2 border-cyan-500 rounded-2xl mt-3">
                <form
                    className="flex flex-col"
                    onSubmit={handleSubmit}
                    autocomplete="off"
                >
                    <label className="text-xs text-left mb-1" for="firstName">
                        first name
                    </label>
                    <input
                        className="input-field"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label className="text-xs text-left mb-1" for="lastName">
                        last name
                    </label>
                    <input
                        className="input-field"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label className="text-xs text-left mb-1" for="email">
                        email
                    </label>
                    <input
                        className="input-field"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="text-xs text-left mb-1" for="mobile">
                        mobile
                    </label>
                    <input
                        className="input-field"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="hidden"
                        className="input-field"
                        name="role"
                        value="student"
                    />

                    <label className="text-xs text-left mb-1" for="password">
                        password
                    </label>
                    <input
                        className="input-field"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="mt-3" type="submit">
                        Sign Up
                    </button>
                    <button
                        className="mt-3"
                        onClick={() => {
                            navigate("/login");
                        }}
                        type="button"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
