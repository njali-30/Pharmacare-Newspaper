import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import "./App.css";

export default function App() {
    return (
        <Router>
            <Navbar />
            <div id="home"><Home /></div>
            <div id="about"><About /></div>
            <div id="contact"><Contact /></div>
            {/* Add other sections like Editions, Specials, Contact below if needed */}
        </Router>
    );
}
