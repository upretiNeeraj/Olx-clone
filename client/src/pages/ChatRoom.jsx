import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import styles from "./ChatRoom.module.css";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(`${API_URL}`, { transports: ["websocket"] });

const ChatRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherUser, setOtherUser] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const messagesEndRef = useRef(null);

    // Scroll always bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Fetch chat + messages
    useEffect(() => {
        const loadChat = async () => {
            try {
                const [msgs, chat] = await Promise.all([
                    axios.get(`${API_URL}/api/messages/${id}`),
                    axios.get(`${API_URL}/api/chat/${id}`, {
                        headers: { Authorization: `Bearer ${user?.token}` }
                    })
                ]);

                setMessages(msgs?.data ?? []);
                const other = chat?.data?.users?.find(u => u?._id !== user?._id) || null;
                setOtherUser(other);

            } catch (err) {
                console.error("Chat Load Error →", err);
            }
        };
        loadChat();
    }, [id, user]);

    // Socket events
    useEffect(() => {
        socket.emit("join_chat", id);

        socket.on("connect", () => setConnectionStatus("connected"));
        socket.on("disconnect", () => setConnectionStatus("disconnected"));
        socket.on("receive_message", msg => setMessages(p => [...p, msg]));

        return () => {
            socket.off("receive_message");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, [id]);

    // Send msg
    const sendMessage = async () => {
        if (!text.trim()) return;
        const msg = {
            chatId: id,
            sender: user?._id,
            text: text.trim(),
            timestamp: new Date()
        };
        try {
            await axios.post(`${API_URL}/api/messages/send`, msg);
            socket.emit("send_message", msg);
            setText("");
        } catch (err) {
            console.error("Send Error →", err);
        }
    };

    // Enter to Send
    const handleKey = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Format time
    const formatTime = (t) => {
        if (!t) return "now";
        return new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    // Initials
    const initials = name => name?.[0]?.toUpperCase() || "U";

    return (
        <div className={styles.container}>

            {/* STATUS BAR */}
            <div className={`${styles.connectionStatus} ${styles[connectionStatus]}`}>
                ● {connectionStatus}
            </div>

            {/* HEADER */}
            <div className={styles.chatHeader}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>←</button>

                {otherUser ? (
                    <>
                        <div className={styles.userAvatar}>{initials(otherUser?.name)}</div>
                        <div className={styles.userInfo}>
                            <h3>{otherUser?.name}</h3>
                            <p>Online</p>
                        </div>
                    </>
                ) : (
                    <p>Loading user...</p> // important fallback
                )}
            </div>

            {/* CHAT BOX */}
            <div className={styles.chatBox}>
                {messages?.length > 0 ? (
                    messages?.map((m, i) => (
                        <div key={i} className={`${styles.message} ${m?.sender === user?._id ? styles.myMessage : styles.otherMessage}`}>
                            <div>{m?.text ?? "No message"}</div>
                            <span className={styles.messageTime}>{formatTime(m?.timestamp ?? m?.createdAt)}</span>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No messages yet</h3>
                        <p>Start chatting...</p>
                    </div>
                )}
                <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT AREA */}
            <div className={styles.inputArea}>
                <textarea
                    className={styles.textInput}
                    placeholder="Type your message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKey}
                />
                <button className={styles.sendButton} onClick={sendMessage} disabled={!text.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
