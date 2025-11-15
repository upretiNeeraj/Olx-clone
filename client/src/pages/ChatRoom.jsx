import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import styles from "./ChatRoom.module.css";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(`${API_URL}`);

const ChatRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherUser, setOtherUser] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const messagesEndRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch previous messages and chat info
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [messagesRes, chatRes] = await Promise.all([
                    axios.get(`${API_URL}/api/messages/${id}`),
                    axios.get(`${API_URL}/api/chat/${id}`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                ]);
                
                setMessages(messagesRes.data);
                
                // Find other user in chat
                const other = chatRes.data.users.find(u => u._id !== user._id);
                setOtherUser(other);
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };
        fetchData();
    }, [id, user]);

    // Socket connection events
    useEffect(() => {
        socket.emit("join_chat", id);

        socket.on("connect", () => setConnectionStatus("connected"));
        socket.on("disconnect", () => setConnectionStatus("disconnected"));
        socket.on("connect_error", () => setConnectionStatus("disconnected"));

        socket.on("receive_message", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off("receive_message");
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
        };
    }, [id]);

    const sendMessage = async () => {
        if (!text.trim()) return;

        const newMsg = { 
            chatId: id, 
            sender: user._id, 
            text: text.trim(),
            timestamp: new Date()
        };

        try {
            await axios.post(`${API_URL}/api/messages/send`, newMsg);
            socket.emit("send_message", newMsg);
            setText("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const getUserInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className={styles.container}>
            {/* Connection Status */}
            <div className={`${styles.connectionStatus} ${styles[connectionStatus]}`}>
                <div className={styles.statusDot}></div>
                {connectionStatus === "connected" ? "Connected" : 
                 connectionStatus === "connecting" ? "Connecting..." : "Disconnected"}
            </div>

            {/* Chat Header */}
            <div className={styles.chatHeader}>
                <button 
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>
                
                {otherUser && (
                    <>
                        <div className={styles.userAvatar}>
                            {getUserInitials(otherUser.name)}
                        </div>
                        <div className={styles.userInfo}>
                            <h3>{otherUser.name}</h3>
                            <p>Online</p>
                        </div>
                    </>
                )}
            </div>

            {/* Messages Area */}
            <div className={styles.chatBox}>
                {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>💬</div>
                        <h3>No messages yet</h3>
                        <p>Start the conversation by sending a message!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${
                                msg.sender === user._id ? styles.myMessage : styles.otherMessage
                            }`}
                        >
                            <div>{msg.text}</div>
                            <div className={styles.messageTime}>
                                {formatTime(msg.timestamp || msg.createdAt)}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <textarea
                        className={styles.textInput}
                        value={text}
                        rows={1}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                    />
                </div>
                <button 
                    className={styles.sendButton}
                    onClick={sendMessage}
                    disabled={!text.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;