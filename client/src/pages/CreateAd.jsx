import React, { useState, useEffect } from "react";
import axios from "axios";
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
    const [location, setLocation] = useState({ lat: "", lon: "" });
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    const [locationName, setLocationName] = useState("");


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                    });
                },
                () => console.log("Location permission blocked")
            );
        }
    }, []);

    useEffect(() => {
        if (location.lat && location.lon) {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`)
                .then(res => res.json())
                .then(data => {
                    setLocationName(
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.locality ||
                        data.address.suburb ||
                        data.address.county ||
                        data.address.state ||
                        data.address.region ||
                        data.display_name?.split(",")[0] ||
                        "Unknown"
                    );

                })
                .catch(() => setLocationName("Unknown"));
        }
    }, [location]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("location", JSON.stringify(locationName));
        data.append("image", image);
        data.append("category", formData.category);



        try {
            console.log([...data]);

            await axios.post(`${API_URL}/api/ads/create`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ Ad Created with Auto Location!");
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong", err);


        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Create Ad</h2>

            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} /><br />

                <input type="text" name="description" placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} /><br />

                <select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select Category</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Car">Car</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                </select>
                <br />

                <input type="number" name="price" placeholder="Price" onChange={(e) => setFormData({ ...formData, price: e.target.value })} /><br />

                {/* <p>📍 Location: {location.lat && location.lon ? `${location.lat}, ${location.lon}` : "Detecting..."}</p> */}
                <p>Live Location 📍 {locationName || "Detecting City..."}</p>

                <input type="file" onChange={(e) => setImage(e.target.files[0])} /><br />


                <button type="submit">Post Ad</button>
            </form>
        </div>
    );
};

export default CreateAd;
