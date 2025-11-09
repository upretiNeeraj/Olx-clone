import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // 👈 CSS module import
const API_URL = import.meta.env.VITE_API_URL;


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Invalid credentials");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login to Your Account</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
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
            Login
          </button>
        </form>
        {message && (
          <p
            className={
              message.includes("✅")
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

export default Login;
