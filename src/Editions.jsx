import React, { useState } from "react";
import "./Editions.css";

export default function Editions() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = 8; // Total pages for the edition

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="editions-page">
            {/* Title */}
            <h1 className="editions-title">Editions</h1>

            {/* Calendar */}
            <div className="editions-top">
                <input
                    type="month"
                    value={selectedDate.substr(0, 7)}
                    onChange={(e) => setSelectedDate(e.target.value + "-01")}
                    className="date-selector"
                />
            </div>

            {/* Body */}
            <div className="editions-container">
                {/* Left: Page Slider */}
                <div className="page-slider">
                    <button className="slider-btn left-btn" onClick={handlePrevPage}>{"<"}</button>

                    <div className="newspaper-placeholder">
                        Page {currentPage}
                    </div>

                    <button className="slider-btn right-btn" onClick={handleNextPage}>{">"}</button>
                </div>

                {/* Right: Paper Info */}
                <div className="paper-info">
                    <h2>PharmaCare - September 2025 Edition</h2>
                    <p><strong>Publication Date:</strong> 17 September 2025</p>
                    <p><strong>Total Pages:</strong> 8</p>
                    <button className="download-btn">Download PDF</button>
                </div>
            </div>
        </div>
    );
}
