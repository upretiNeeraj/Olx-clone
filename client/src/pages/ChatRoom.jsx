import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;




const socket = io(`${API_URL}`); // socket connect

const ChatRoom = () => {
    const { id } = useParams(); // chatId
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    // ✅ Fetch previous messages when page opens
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await axios.get(`${API_URL}/api/messages/${id}`);
            setMessages(res.data);
        };
        fetchMessages();
    }, [id]);

    // ✅ Join Chat Room & listen for real-time messages
    useEffect(() => {
        socket.emit("join_chat", id);

        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.off("receive_message");
    }, [id]);

    // ✅ Send message
    const sendMessage = async () => {
        if (!text.trim()) return;

        const newMsg = { chatId: id, sender: user._id, text };

        await axios.post(`${API_URL}/api/messages/send`, newMsg); // save to db
        socket.emit("send_message", newMsg); // send realtime

        setText("");
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatBox}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.msg,
                            alignSelf: msg.sender === user._id ? "flex-end" : "flex-start",
                            background: msg.sender === user._id ? "#DCF8C6" : "#FFF"
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div style={styles.inputBox} >
                <textarea
                    style={styles.input}
                    value={text}
                    rows={1}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter" & !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                        }
                    }} />
                <button style={styles.sendBtn} onSubmit={sendMessage} onClick={sendMessage}>Send</button>
            </div>

        </div>
    );
};

const styles = {
    container: { height: "90vh", display: "flex", flexDirection: "column", padding: "10px" },
    chatBox: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" },
    msg: { padding: "8px 12px", borderRadius: 6, maxWidth: "60%" },
    inputBox: { display: "flex", gap: 10, marginTop: 10 },
    input: { flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" },
    sendBtn: { padding: "8px 16px", cursor: "pointer" }
};

export default ChatRoom;
