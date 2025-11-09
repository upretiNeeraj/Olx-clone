import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;



const AllAds = ({ searchQuery }) => {
    const [ads, setAds] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/ads`);
                setAds(res.data);
                setFiltered(res.data);
            } catch (error) {
                console.log(error);
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

    return (
        <div style={{ display: "flex" }}>

            {/* ✅ Sidebar */}
            <div style={{ width: "220px", padding: "15px", borderRight: "1px solid #ddd" }}>
                <h3>Filters</h3>

                <label>Category:</label><br />
                <select onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Car">Car</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                </select>

                <br /><br />

                <label>Max Price:</label><br />
                <input type="number" onChange={(e) => setMaxPrice(e.target.value)} />

                <br /><br />

                <label>Sort:</label><br />
                <select onChange={(e) => setSort(e.target.value)}>
                    <option value="">None</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
                </select>
            </div>

            {/* ✅ Ads Section */}
            <div style={{ padding: "20px", flex: 1 }}>
                <h2>All Listings</h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "15px",
                    marginTop: "20px"
                }}>
                    {filtered.map((ad) => (
                        <Link to={`/ad/${ad._id}`} key={ad._id} style={{ textDecoration: "none", color: "inherit" }}>
                            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
                                <img src={ad.image} style={{ width: "100%", height: 170, objectFit: "cover" }} />
                                <h3>{ad.title}</h3>
                                <h4>₹ {ad.price}</h4>
                                <p>📍 {ad.location}</p>
                            </div>
                        </Link>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default AllAds;


