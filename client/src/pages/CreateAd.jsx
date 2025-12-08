import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateAd.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const CreateAd = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        location: ""
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [fileName, setFileName] = useState("");

    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location || !image) {
            setMessage({ type: "error", text: "Please fill all fields and select an image" });
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("location", formData.location); // MANUAL LOCATION ONLY
        data.append("image", image);
        data.append("category", formData.category);

        try {
            await axios.post(`${API_URL}/api/ads/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            setMessage({ type: "success", text: "✅ Ad created successfully!" });

            // Reset form
            setFormData({
                title: "",
                description: "",
                price: "",
                category: "",
                location: ""
            });
            setImage(null);
            setFileName("");
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setFileName(file.name);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Create New Ad</h2>

            {message.text && (
                <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>

                {/* Title */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Title</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter ad title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                {/* Description */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Describe your item"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                {/* Category */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Category</label>
                    <select
                        className={styles.select}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Car">Car</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Price */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Price (₹)</label>
                    <div className={styles.priceContainer}>
                        <span className={styles.currencySymbol}>₹</span>
                        <input
                            type="number"
                            className={`${styles.input} ${styles.priceInput}`}
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            min="0"
                        />
                    </div>
                </div>

                {/* Manual Location */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter your location manually (e.g., Kalanga, Dehradun)"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Product Image</label>
                    <input
                        type="file"
                        id="image"
                        className={styles.fileInput}
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                    <label htmlFor="image" className={styles.fileLabel}>
                        📸 {fileName ? "Change Image" : "Choose Image"}
                    </label>
                    {fileName && <div className={styles.fileName}>Selected: {fileName}</div>}
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading && <span className={styles.loading}></span>}
                    {loading ? "Creating Ad..." : "🚀 Post Ad"}
                </button>
            </form>
        </div>
    );
};

export default CreateAd;
