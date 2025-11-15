import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState(null);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo ? userInfo.token : null;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
                setLoading(false);
            } catch (err) {
                console.log("Not authorized");
                setLoading(false);
            }
        };

        if (token) {
            fetchUser();
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    if (!token) {
        navigate("/login");
        return null;
    }

    const handleMyAds = async () => {
        try {
            if (ads) {
                setAds(null);
                return;
            }
            const res = await axios.get(`${API_URL}/api/ads/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAds(res.data);
        } catch (error) {
            console.log("Error fetching ads:", error);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>👤 Profile</h2>
                <p className={styles.loading}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>👤 Profile</h2>

            {user ? (
                <div className={styles.profileCard}>
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            ) : (
                <p className={styles.loading}>Loading profile...</p>
            )}

            <div className={styles.buttonGroup}>
                <Link to="/create-ad" className={styles.button}>
                    ➕ Post New Ad
                </Link>
                <button onClick={handleMyAds} className={styles.button}>
                    {ads ? "👁️ Hide My Ads" : "📦 Show My Ads"}
                </button>
            </div>

            {/* Ads Section */}
            {ads ? (
                ads.length > 0 ? (
                    <div className={styles.adsContainer}>
                        {ads.map((item, index) => (
                            <div key={index} className={styles.adCard}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={styles.image}
                                />
                                <div className={styles.adDetails}>
                                    <h3 className={styles.adTitle}>{item.title}</h3>
                                    <p className={styles.adPrice}>💰 ₹{item.price.toLocaleString()}</p>
                                    <p className={styles.adDesc}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noAds}>You haven't posted any ads yet. Start selling today! 🎯</p>
                )
            ) : null}
        </div>
    );
};

export default Profile;