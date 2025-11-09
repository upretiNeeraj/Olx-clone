import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Inbox = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchChats = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/chat/my", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                console.log("Chats Received:", res.data);

                setChats(res.data);
            } catch (err) {
                console.log("Inbox Load Error:", err.response?.data || err);
            }
        };
        // console.log("Chats Received:", res.data);

        fetchChats();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>💬 Your Chats</h2>
            <br />

            {chats.length === 0 && <p>No chats yet...</p>}

            {chats.map((chat) => {
                const other = chat.users.find((u) => u._id !== user._id);

                if (!other) return null;

                return (
                    <Link
                        key={chat._id}
                        to={`/chat/${chat._id}`}
                        style={{
                            display: "block",
                            padding: "12px",
                            borderBottom: "1px solid #ddd",
                            textDecoration: "none",
                            color: "#333",
                            fontSize: "18px"
                        }}
                    >
                        <strong>👤 {other.name}</strong>
                    </Link>
                );
            })}
            {/* <p> yo yo honey singh{chats}</p> */}

        </div>
    );
};

export default Inbox;
