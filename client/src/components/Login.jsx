import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setMessage("✅ Login successful!");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Invalid credentials");
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

      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
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
          </div>

          <button
            type="submit"
            className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        {message && (
          <p className={message.includes("✅") ? styles.successMsg : styles.errorMsg}>
            {message}
          </p>
        )}

        <div className={styles.additionalLinks}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className={styles.registerLink}>
              Sign up here
            </Link>
          </p>
        </div>

        {/* Social Login Section */}
        <div className={styles.socialLogin}>
          <div className={styles.socialDivider}>
            <span>Or continue with</span>
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

export default Login;