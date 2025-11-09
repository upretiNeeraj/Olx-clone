import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"; // 👈 Import CSS module

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5001/api/auth/register", formData);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setMessage("🎉 Registration successful!");
            setTimeout(() => navigate("/login"), 1200);
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create Your Account</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                </form>
                {message && (
                    <p
                        className={
                            message.includes("🎉")
                                ? styles.successMsg
                                : styles.errorMsg
                        }
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
