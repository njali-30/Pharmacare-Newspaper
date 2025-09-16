import React, { useRef, useState } from "react";
import "./Specials.css";

const allSpecialEditions = [
    { title: "PharmaCare Special - August 2025", pdfUrl: "/pdfs/pharmacare_aug2025.pdf", year: 2025 },
    { title: "Health Today - July 2025", pdfUrl: "/pdfs/healthtoday_jul2025.pdf", year: 2025 },
    { title: "Medical Weekly - June 2024", pdfUrl: "/pdfs/medicalweekly_jun2024.pdf", year: 2024 },
    { title: "Wellness Monthly - May 2024", pdfUrl: "/pdfs/wellness_may2024.pdf", year: 2024 },
    { title: "Care Focus - April 2023", pdfUrl: "/pdfs/carefocus_apr2023.pdf", year: 2023 },
];

export default function SpecialEditions() {
    const tabsRef = useRef(null);
    const years = [...new Set(allSpecialEditions.map(e => e.year))].sort((a,b)=>b-a);

    // null = show all, otherwise a year
    const [selectedYear, setSelectedYear] = useState(null);

    const filteredEditions = selectedYear
        ? allSpecialEditions.filter(e => e.year === parseInt(selectedYear))
        : allSpecialEditions;

    const scrollLeft = () => { tabsRef.current.scrollBy({ left: -300, behavior: "smooth" }); };
    const scrollRight = () => { tabsRef.current.scrollBy({ left: 300, behavior: "smooth" }); };
    const handleOpenPDF = (pdfUrl) => { window.open(pdfUrl, "_blank"); };

    return (
        <div className="special-page">
            <h1 className="special-title">Special Editions</h1>

            {/* Year Selector Dropdown */}
            <div className="year-selector-container">
                <label htmlFor="year-selector">Select Year:</label>
                <select
                    id="year-selector"
                    value={selectedYear || ""}
                    onChange={(e) => setSelectedYear(e.target.value || null)}
                    className="year-selector"
                >
                    <option value="">All Years</option>
                    {years.map((year, idx) => <option key={idx} value={year}>{year}</option>)}
                </select>
            </div>

            {/* Tabs with scroll buttons */}
            <div className="tabs-wrapper">
                <button className="scroll-btn left-scroll" onClick={scrollLeft}>{"<"}</button>

                <div className="tabs-container" ref={tabsRef}>
                    {filteredEditions.length === 0 ? (
                        <p className="no-editions">No special editions found for {selectedYear}</p>
                    ) : (
                        filteredEditions.map((edition, index) => (
                            <div
                                key={index}
                                className="tab-card"
                                onClick={() => handleOpenPDF(edition.pdfUrl)}
                            >
                                <div className="tab-preview"><p>Page 1</p></div>
                                <h3 className="tab-title">{edition.title}</h3>
                            </div>
                        ))
                    )}
                </div>

                <button className="scroll-btn right-scroll" onClick={scrollRight}>{">"}</button>
            </div>
        </div>
    );
}
