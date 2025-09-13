import React from "react";
import "./Contact.css";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const ContactUs = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent successfully!");
    };

    return (
        <div className="contact-page">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
                Have questions, suggestions, or feedback? We'd love to hear from you.
                Get in touch with our team.
            </p>

            <div className="contact-container">
                {/* Left Box - Send Message */}
                <div className="contact-box">
                    <h2>Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input type="text" placeholder="Full Name" required />
                        <input type="email" placeholder="Email Address" required />
                        <textarea placeholder="Message" rows="5" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>

                {/* Right Side */}
                <div className="right-side">
                    {/* Get in Touch */}
                    <div className="contact-box">
                        <h2>Get in Touch</h2>
                        <div className="contact-info">
                            <FaEnvelope className="icon" />
                            <div>
                                <h4>Email Address</h4>
                                <p>editorial@pharmacare.com</p>
                                <p>info@pharmacare.com</p>
                            </div>
                        </div>
                        <div className="contact-info">
                            <FaPhone className="icon" />
                            <div>
                                <h4>Phone Numbers</h4>
                                <p>+91 98765 43210</p>
                                <p>+91 87654 32109</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="contact-box">
                        <h2>Business Hours</h2>
                        <p><strong>Monday - Friday:</strong> 9:00 AM – 6:00 PM</p>
                        <p><strong>Saturday:</strong> 10:00 AM – 4:00 PM</p>
                        <p><strong>Sunday:</strong> Closed</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>PharmaCare</h3>
                        <p>Your trusted companion for healthcare news and pharmaceutical insights.</p>
                        <p>© 2025 PharmaCare — All rights reserved.</p>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>Home</li>
                            <li>About Us</li>
                            <li>Latest Editions</li>
                            <li>Special Editions</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li>Contact Us</li>
                            <li>FAQ</li>
                            <li>Admin Portal</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Admin Contact</h3>
                        <p>Email: admin@pharmacare.example</p>
                        <p>Phone: +91 98765 43210</p>
                        <p>Support: Mon–Fri 9AM–6PM</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactUs;