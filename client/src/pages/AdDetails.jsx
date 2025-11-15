import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./AdDetails.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/ads/${id}`);
                setAd(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load ad details");
                setLoading(false);
                console.error("Error fetching ad:", err);
            }
        };
        fetchAd();
    }, [id]);

    const startChat = async (sellerId) => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/chat/start`,
                { sellerId },
                { headers: { Authorization: `Bearer ${user.token}` } });

            navigate(`/chat/${res.data._id}`);
        } catch (error) {
            console.error("Error starting chat:", error);
            alert("Failed to start chat. Please try again.");
        }
    };

    const formatLocation = (location) => {
        if (typeof location === 'string') {
            try {
                const parsed = JSON.parse(location);
                return parsed || location;
            } catch {
                return location;
            }
        }
        return location || "Location not specified";
    };

    const getUserInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading ad details...</div>
            </div>
        );
    }

    if (error || !ad) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Ad not found</h2>
                    <p>{error || "The ad you're looking for doesn't exist."}</p>
                    <Link to="/" className={styles.backButton}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <Link to="/" className={styles.backButton}>
                ← Back to All Ads
            </Link>

            <div className={styles.content}>
                {/* Image Section */}
                <div className={styles.imageSection}>
                    <img
                        src={ad.image}
                        alt={ad.title}
                        className={styles.mainImage}
                    />
                </div>

                {/* Details Section */}
                <div className={styles.detailsSection}>
                    {/* Category Badge */}
                    <div className={styles.categoryBadge}>
                        {ad.category || "Uncategorized"}
                    </div>

                    <h1 className={styles.title}>{ad.title}</h1>
                    <h2 className={styles.price}>₹ {ad.price?.toLocaleString()}</h2>

                    {/* Description */}
                    <div className={styles.description}>
                        {ad.description}
                    </div>

                    {/* Info Grid */}
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>📍</span>
                            <div className={styles.infoText}>
                                <span className={styles.infoLabel}>Location</span>
                                <span className={styles.infoValue}>
                                    {formatLocation(ad.location)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>📅</span>
                            <div className={styles.infoText}>
                                <span className={styles.infoLabel}>Listed</span>
                                <span className={styles.infoValue}>
                                    {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "Recently"}
                                </span>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>🏷️</span>
                            <div className={styles.infoText}>
                                <span className={styles.infoLabel}>Category</span>
                                <span className={styles.infoValue}>
                                    {ad.category || "General"}
                                </span>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <span className={styles.infoIcon}>👀</span>
                            <div className={styles.infoText}>
                                <span className={styles.infoLabel}>Condition</span>
                                <span className={styles.infoValue}>
                                    {ad.condition || "Good"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Seller Information */}
                    <div className={styles.sellerSection}>
                        <h3 className={styles.sellerTitle}>👤 Seller Information</h3>
                        <div className={styles.sellerInfo}>
                            <div className={styles.sellerAvatar}>
                                {getUserInitials(ad.user?.name)}
                            </div>
                            <div className={styles.sellerDetails}>
                                <h4 className={styles.sellerName}>{ad.user?.name || "Unknown Seller"}</h4>
                                <div className={styles.sellerRating}>
                                    ⭐ 4.8 • 50+ reviews
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.chatButton}
                            onClick={() => startChat(ad.user?._id)}
                        >
                            💬 Chat with Seller
                        </button>

                        <button className={styles.wishlistButton}>
                            ❤️ Save to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;