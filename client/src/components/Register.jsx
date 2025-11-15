import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "" 
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Password strength calculation
        if (name === "password") {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        const strengthLevels = ["", "weak", "medium", "strong", "very-strong"];
        setPasswordStrength(strengthLevels[strength] || "");
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
            case "weak": return "Weak password";
            case "medium": return "Medium strength";
            case "strong": return "Strong password";
            case "very-strong": return "Very strong password";
            default: return "Enter a password";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!acceptedTerms) {
            setMessage("❌ Please accept the terms and conditions");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setMessage("🎉 Registration successful!");
            
            setTimeout(() => {
                navigate("/profile");
            }, 1200);
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.container}>
            {/* Decorative Elements */}
            <div className={styles.decoration}></div>
            <div className={styles.decoration}></div>
            <div className={styles.decoration}></div>

            <div className={styles.card}>
                <h2 className={styles.title}>Join MyMarket</h2>
                <p className={styles.subtitle}>
                    Create your account and start selling today
                </p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="name"
                            placeholder=" "
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <label className={styles.floatingLabel}>Full Name</label>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <label className={styles.floatingLabel}>Email Address</label>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder=" "
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <label className={styles.floatingLabel}>Password</label>
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                        
                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className={styles.passwordStrength}>
                                <div className={styles.strengthBar}>
                                    <div className={`${styles.strengthFill} ${getPasswordStrengthClass()}`}></div>
                                </div>
                                <div className={styles.strengthText}>
                                    {getPasswordStrengthText()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className={styles.terms}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className={styles.termsCheckbox}
                            required
                        />
                        <label htmlFor="terms" className={styles.termsLabel}>
                            I agree to the{" "}
                            <a href="/terms" className={styles.termsLink}>
                                Terms and Conditions
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className={styles.termsLink}>
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
                        disabled={loading || !acceptedTerms}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {message && (
                    <p className={message.includes("🎉") ? styles.successMsg : styles.errorMsg}>
                        {message}
                    </p>
                )}

                <div className={styles.additionalLinks}>
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className={styles.loginLink}>
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* Social Login Section */}
                <div className={styles.socialLogin}>
                    <div className={styles.socialDivider}>
                        <span>Or sign up with</span>
                    </div>
                    
                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.socialButton}>
                            🔵 Google
                        </button>
                        <button type="button" className={styles.socialButton}>
                            ⚫ GitHub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;