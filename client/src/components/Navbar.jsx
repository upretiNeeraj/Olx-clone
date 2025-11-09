import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ use NavLink instead of Link
import styles from "./Navbar.module.css";

const Navbar = ({ setSearchQuery }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [text, setText] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    const handleSearch = (e) => {
        setText(e.target.value);
        setSearchQuery(e.target.value);
    };

    return (
        <nav className={styles.navbar}>
            {/* ✅ Logo */}
            <div className={styles.logo} onClick={() => navigate("/")}>
                🛒 MyMarket
            </div>

            {/* ✅ Navigation Links */}
            <div className={styles.links}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    }
                >
                    Profile
                </NavLink>

                {user ? (
                    <>
                        <span className={styles.welcome}>Hi, {user.name}</span>

                        <NavLink
                            to="/inbox"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Inbox
                        </NavLink>

                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            Register
                        </NavLink>
                    </>
                )}

                <input
                    type="text"
                    placeholder="Search item..."
                    value={text}
                    onChange={handleSearch}
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #aaa",
                        width: "200px",
                    }}
                />
            </div>
        </nav>
    );
};

export default Navbar;
