import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import styles from "./Register.module.css";

const API_URL = import.meta.env.VITE_API_URL;

// ZOD SCHEMA
const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/\d/, "Must include 1 number")
        .regex(/[^a-zA-Z0-9]/, "Must include 1 special character")
});

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    // UI Password Strength
    const calculatePasswordStrength = (password) => {
        let s = 0;
        if (password.length >= 8) s++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
        if (/\d/.test(password)) s++;
        if (/[^a-zA-Z0-9]/.test(password)) s++;
        // console.log("password score = ", s);
        // console.log("class = ", ["", "weak", "medium", "strong", "very-strong"][s]);

        setPasswordStrength(["", "weak", "medium", "strong", "very-strong"][s]);
    };

    const getPasswordStrengthClass = () => {
        switch (passwordStrength) {
            case "weak": return styles.strengthWeak;
            case "medium": return styles.strengthMedium;
            case "strong":
            case "very-strong":
                return styles.strengthStrong;
            default: return "";
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case "weak": return "Weak";
            case "medium": return "Medium strength";
            case "strong": return "Strong";
            case "very-strong": return "Very Strong";
            default: return "Enter password";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "password") calculatePasswordStrength(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        // ZOD VALIDATION FIRST
        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const msg = result.error?.errors?.[0]?.message || "Invalid input data";
            setMessage("❌ " + msg);
            setLoading(false);
            return;
        }


        if (!acceptedTerms) {
            setMessage("❌ Please accept Terms & Conditions");
            setLoading(false);
            return;
        }

        // IF VALID -> SEND REQUEST
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setMessage("🎉 Registration Successful!");

            setTimeout(() => navigate("/profile"), 1200);
        } catch (error) {
            setMessage("something went wrong")

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Join MyMarket</h2>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Name */}
                    <div className={styles.inputGroup}>
                        <input type="text" name="name" placeholder=" " value={formData.name}
                            onChange={handleChange} className={styles.input} required />
                        <label className={styles.floatingLabel}>Full Name</label>
                    </div>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                        <input type="email" name="email" placeholder=" " value={formData.email}
                            onChange={handleChange} className={styles.input} required />
                        <label className={styles.floatingLabel}>Email Address</label>
                    </div>

                    {/* Password */}
                    <div className={styles.inputGroup}>
                        <input type={showPassword ? "text" : "password"} name="password"
                            placeholder=" " value={formData.password} onChange={handleChange}
                            className={styles.input} required />

                        <label className={styles.floatingLabel}>Password</label>

                        <button type="button" className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "🙈" : "👁️"}
                        </button>

                        {formData.password && (
                            <div className={styles.passwordStrength}>
                                <div className={styles.strengthBar}>
                                    <div className={`${styles.strengthFill} ${getPasswordStrengthClass()}`}></div>
                                </div>
                                <p className={styles.strengthText}>{getPasswordStrengthText()}</p>
                            </div>
                        )}
                    </div>

                    {/* Terms */}
                    <div className={styles.terms}>
                        <input type="checkbox" id="terms" checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)} required />
                        <label htmlFor="terms">I agree to Terms & Privacy Policy</label>
                    </div>

                    <button type="submit" disabled={loading || !acceptedTerms}
                        className={`${styles.button} ${loading && styles.buttonLoading}`}>
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                {message && (
                    <p className={message.includes("🎉") ? styles.successMsg : styles.errorMsg}>
                        {message}
                    </p>
                )}

                <p>Already have account? <Link to="/login" className={styles.loginLink}>Sign in</Link></p>
            </div>
        </div>
    );
};

export default Register;
