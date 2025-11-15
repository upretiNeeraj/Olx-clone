import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./AllAds.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const AllAds = ({ searchQuery }) => {
    const [ads, setAds] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/ads`);
                setAds(res.data);
                setFiltered(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        let result = [...ads];

        if (searchQuery) {
            result = result.filter(
                (ad) =>
                    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ad.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter) {
            result = result.filter((ad) => ad.category === categoryFilter);
        }

        if (maxPrice) {
            result = result.filter((ad) => ad.price <= maxPrice);
        }

        if (sort === "low") result.sort((a, b) => a.price - b.price);
        if (sort === "high") result.sort((a, b) => b.price - a.price);

        setFiltered(result);
    }, [searchQuery, categoryFilter, maxPrice, sort, ads]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <h3>Filters</h3>
                    <div className={styles.filterGroup}>
                        <label>Category:</label>
                        <select className={styles.filterSelect} disabled>
                            <option>Loading...</option>
                        </select>
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <h2>All Listings</h2>
                    <div className={styles.loadingGrid}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={styles.loadingCard}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <h3>Filters</h3>

                <div className={styles.filterGroup}>
                    <label>Category:</label>
                    <select
                        className={styles.filterSelect}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        value={categoryFilter}
                    >
                        <option value="">All Categories</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Car">Car</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Max Price:</label>
                    <input
                        type="number"
                        className={styles.filterInput}
                        placeholder="Enter max price"
                        onChange={(e) => setMaxPrice(e.target.value)}
                        value={maxPrice}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label>Sort By:</label>
                    <select
                        className={styles.filterSelect}
                        onChange={(e) => setSort(e.target.value)}
                        value={sort}
                    >
                        <option value="">Recommended</option>
                        <option value="low">Price: Low → High</option>
                        <option value="high">Price: High → Low</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2>All Listings</h2>
                    <div className={styles.resultsCount}>
                        {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
                    </div>
                </div>

                <div className={styles.adsGrid}>
                    {filtered.length > 0 ? (
                        filtered.map((ad) => (
                            <Link to={`/ad/${ad._id}`} key={ad._id} className={styles.adCard}>
                                <img
                                    src={ad.image}
                                    loading="lazy"
                                    className={styles.adImage}
                                    alt={ad.title}
                                />
                                <div className={styles.adContent}>
                                    <h3 className={styles.adTitle}>{ad.title}</h3>
                                    <h4 className={styles.adPrice}>₹ {ad.price.toLocaleString()}</h4>
                                    <p className={styles.adLocation}>{ad.location}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No listings found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllAds;