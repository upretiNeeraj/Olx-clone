import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Inbox.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const Inbox = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchChats = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/chat/my`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                console.log("Chats Received:", res.data);
                setChats(res.data);
                setLoading(false);
            } catch (err) {
                console.log("Inbox Load Error:", err.response?.data || err);
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    const getUserInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 24 * 60 * 60 * 1000) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>💬 Your Chats</h2>
                <div className={styles.loadingContainer}>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className={styles.loadingChat}>
                            <div className={styles.loadingAvatar}></div>
                            <div className={styles.loadingText}>
                                <div className={styles.loadingName}></div>
                                <div className={styles.loadingMessage}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>💬 Your Chats</h2>

            {chats.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>💬</div>
                    <h3>No chats yet</h3>
                    <p>Start a conversation by messaging someone about their ads!</p>
                </div>
            ) : (
                <div className={styles.chatsContainer}>
                    {chats.map((chat, index) => {
                        const other = chat.users.find((u) => u._id !== user._id);

                        if (!other) return null;

                        return (
                            <Link
                                key={chat._id}
                                to={`/chat/${chat._id}`}
                                className={styles.chatItem}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={styles.chatContent}>
                                    <div className={styles.avatarContainer}>
                                        <div className={styles.userAvatar}>
                                            {getUserInitials(other.name)}
                                        </div>
                                    </div>

                                    <div className={styles.userInfo}>
                                        <h3 className={styles.userName}>{other.name}</h3>
                                        <p className={styles.lastMessage}>
                                            {chat.lastMessage?.text || "Start a conversation..."}
                                        </p>
                                    </div>

                                    <div className={styles.chatMeta}>
                                        <span className={styles.timestamp}>
                                            {formatTimestamp(chat.updatedAt)}
                                        </span>
                                        {chat.unreadCount > 0 && (
                                            <span className={styles.unreadBadge}>
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Inbox;