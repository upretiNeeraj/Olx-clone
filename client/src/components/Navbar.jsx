import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        setText(e.target.value)
        setSearchQuery(e.target.value)
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo} onClick={() => navigate("/")}>
                🛒 MyMarket
            </div>

            <div className={styles.links}>
                <Link to="/" className={styles.link}>Home</Link>
                <Link to="/profile" className={styles.link}>Profile</Link>



                {user ? (
                    <>
                        <span className={styles.welcome}>Hi, {user.name}</span>
                        <Link to="/inbox">Inbox</Link>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={styles.link}>Login</Link>
                        <Link to="/register" className={styles.link}>Register</Link>
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
                        width: "200px"
                    }}
                />
            </div>
        </nav>
    );
};

export default Navbar;
