import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import styles from "./ChatRoom.module.css";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL, { transports: ["websocket"] });

export default function ChatRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherUser, setOtherUser] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 🟢 Load chat + messages
    useEffect(() => {
        const load = async () => {
            try {
                const msgRes = await axios.get(`${API_URL}/api/messages/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                const chatRes = await axios.get(`${API_URL}/api/chat/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                setMessages(msgRes.data);
                setOtherUser(chatRes.data.users.find(u => u._id !== user._id));
            } catch (e) {
                console.log("Chat Load Error →", e.response?.data || e);
            }
        };
        load();
    }, [id]);

    // 🔥 Live receive from other user
    useEffect(() => {
        socket.emit("join_chat", id);
        socket.on("receive_message", msg => setMessages(p => [...p, msg]));
        return () => socket.off("receive_message");
    }, [id]);

    // 🔥 Send message
    const sendMessage = async () => {
        if (!text.trim()) return;

        try {
            const { data } = await axios.post(
                `${API_URL}/api/messages/send`,
                { chatId: id, text },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setMessages(prev => [...prev, data]); // show instantly
            socket.emit("send_message", data);    // realtime live
            setText("");                           // clear input
        } catch (e) {
            console.log("Send Error:", e.response?.data || e);
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>←</button>
            <h2>Chat with {otherUser?.name || "Loading..."}</h2>

            <div className={styles.chatBox}>
                {messages.map((m, i) => (
                    <div key={i} className={m.sender === user._id ? styles.me : styles.them}>
                        {m.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
