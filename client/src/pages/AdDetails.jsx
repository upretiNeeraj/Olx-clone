import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


const AdDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("userInfo"));



    useEffect(() => {
        const fetchAd = async () => {
            const res = await axios.get(`${API_URL}/api/ads/${id}`);
            setAd(res.data);
        };
        fetchAd();
    }, [id]);

    const startChat = async (sellerId) => {
        const res = await axios.post(`${API_URL}/api/chat/start`,
            { sellerId },
            { headers: { Authorization: `Bearer ${user.token}` } });

        navigate(`/chat/${res.data._id}`);
    };

    if (!ad) return <h2>Loading...</h2>;

    return (
        <div style={{ padding: "20px" }}>
            <img src={ad.image} style={{ width: "350px", borderRadius: "8px" }} />
            <h1>{ad.title}</h1>
            <h2>₹ {ad.price}</h2>
            <p>{ad.description}</p>
            <p>Location📍 {ad.location}</p>
            <h4>Seller: {ad.user?.name}</h4>
            <button onClick={() => startChat(ad.user._id)}>Chat with Seller</button>

        </div>
    );
};

export default AdDetails;
