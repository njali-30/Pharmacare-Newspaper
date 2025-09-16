import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Editions from "./Editions";
import Specials from "./Specials";
import Contact from "./ContactUs";
import Admin from "./Admin";
import "./App.css";

export default function App() {
    return (
        <Router>
            <Navbar />

            {/* Scrollable homepage sections */}
            <div id="home"><Home /></div>
            <div id="about"><About /></div>
            <div id="editions"><Editions /></div>
            <div id="specials"><Specials /></div>
            <div id="contact"><Contact /></div>



        </Router>
    );
}
