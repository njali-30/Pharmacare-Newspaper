import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const [active, setActive] = useState("home");
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (id, e) => {
        e.preventDefault();
        const path = id.toLowerCase() === "home" ? "/" : `/${id.toLowerCase()}`;
        navigate(path);
        setActive(id.toLowerCase());
    };

    // Update active tab when route changes
    useEffect(() => {
        const current = location.pathname === "/" ? "home" : location.pathname.slice(1);
        setActive(current);
    }, [location]);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a
                    href="/"
                    className="brand"
                    onClick={(e) => handleNavigation("home", e)}
                >
                    PharmaCare
                </a>
            </div>

            <div className="navbar-center">
                {["Home", "About", "Editions", "Specials", "Contact", "Faqs"].map((id) => (
                    <a
                        key={id}
                        href={`/${id.toLowerCase()}`}
                        className={active === id.toLowerCase() ? "active-link" : ""}
                        onClick={(e) => handleNavigation(id, e)}
                    >
                        {id}
                    </a>
                ))}
            </div>

            <div className="navbar-right">
                <Link to="/admin" className="admin-btn">
                    Admin
                </Link>
            </div>
        </nav>
    );
}
