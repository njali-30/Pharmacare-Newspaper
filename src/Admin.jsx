import React, { useState, useEffect } from "react";
import "./App.css";

// ========== Admin Login ==========
function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === "admin@example.com" && password === "password") {
            onLogin();
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

// ========== Admin Panel ==========
function AdminPanel({ onLogout }) {
    const [activeTab, setActiveTab] = useState("insert");
    const [newspapers, setNewspapers] = useState({});
    const [form, setForm] = useState({ date: "", title: "", pages: [] });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("newspapers");
        if (saved) setNewspapers(JSON.parse(saved));
    }, []);

    const saveToStorage = (data) => {
        localStorage.setItem("newspapers", JSON.stringify(data));
        setNewspapers(data);
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 2500);
    };

    // helper: upload file(s) and convert to base64
    const convertFilesToBase64 = (files) => {
        const fileArray = Array.from(files);
        const readers = fileArray.map(
            (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        );
        return Promise.all(readers);
    };

    return (
        <div className="admin-container">
            <h1>📰 Newspaper Admin Panel</h1>
            <div className="tabs">
                <button onClick={() => setActiveTab("insert")}>Insert</button>
                <button onClick={() => setActiveTab("update")}>Update</button>
                <button onClick={() => setActiveTab("delete")}>Delete</button>
                <button onClick={() => setActiveTab("view")}>View</button>
                <button className="logout" onClick={onLogout}>
                    Logout
                </button>
            </div>

            {message && <p className="message">{message}</p>}

            {/* INSERT */}
            {activeTab === "insert" && (
                <form
                    className="form-card"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!form.date) return alert("Please select a date");
                        const updated = {
                            ...newspapers,
                            [form.date]: { title: form.title, pages: form.pages },
                        };
                        saveToStorage(updated);
                        setForm({ date: "", title: "", pages: [] });
                        showMessage("Edition inserted successfully ✅");
                    }}
                >
                    <label>Date</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                    />
                    <label>Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Edition title"
                    />

                    <label>Upload Pages</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={async (e) => {
                            const results = await convertFilesToBase64(e.target.files);
                            setForm({ ...form, pages: results });
                        }}
                    />

                    <button type="submit">Insert Edition</button>
                </form>
            )}

            {/* UPDATE */}
            {activeTab === "update" && (
                <form
                    className="form-card"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!form.date || !newspapers[form.date]) {
                            alert("Edition not found");
                            return;
                        }
                        const updated = {
                            ...newspapers,
                            [form.date]: {
                                title: form.title || newspapers[form.date].title,
                                pages: form.pages,
                            },
                        };
                        saveToStorage(updated);
                        setForm({ date: "", title: "", pages: [] });
                        showMessage("Edition updated successfully ✏");
                    }}
                >
                    <label>Date</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => {
                            const date = e.target.value;
                            if (newspapers[date]) {
                                setForm({
                                    date,
                                    title: newspapers[date].title,
                                    pages: [...newspapers[date].pages],
                                });
                            } else {
                                setForm({ date, title: "", pages: [] });
                            }
                        }}
                        required
                    />

                    {form.date && newspapers[form.date] && (
                        <>
                            <label>Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />

                            <h4>Existing Pages</h4>
                            {form.pages.map((page, idx) => (
                                <div key={idx} className="page-edit-card">
                                    <h5>Page {idx + 1}</h5>
                                    {page.startsWith("data:application/pdf") ? (
                                        <embed
                                            src={page}
                                            type="application/pdf"
                                            width="100%"
                                            height="200px"
                                        />
                                    ) : (
                                        <img src={page} alt={`Page ${idx + 1}`} />
                                    )}

                                    <div className="page-actions">
                                        <label className="replace-btn">
                                            Replace
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                style={{ display: "none" }}
                                                onChange={async (e) => {
                                                    const results = await convertFilesToBase64(
                                                        e.target.files
                                                    );
                                                    const newPages = [...form.pages];
                                                    newPages[idx] = results[0]; // replace single file
                                                    setForm({ ...form, pages: newPages });
                                                }}
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            className="danger"
                                            onClick={() => {
                                                const newPages = form.pages.filter(
                                                    (_, i) => i !== idx
                                                );
                                                setForm({ ...form, pages: newPages });
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <label>Add More Pages</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*,.pdf"
                                onChange={async (e) => {
                                    const results = await convertFilesToBase64(e.target.files);
                                    setForm({ ...form, pages: [...form.pages, ...results] });
                                }}
                            />
                        </>
                    )}

                    <button type="submit">Update Edition</button>
                </form>
            )}

            {/* DELETE */}
            {activeTab === "delete" && (
                <form
                    className="form-card"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!form.date || !newspapers[form.date]) {
                            alert("Edition not found");
                            return;
                        }
                        const updated = { ...newspapers };
                        delete updated[form.date];
                        saveToStorage(updated);
                        setForm({ date: "", title: "", pages: [] });
                        showMessage("Edition deleted 🗑");
                    }}
                >
                    <label>Date</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                    />

                    <button type="submit" className="danger">
                        Delete Edition
                    </button>
                </form>
            )}

            {/* VIEW */}
            {activeTab === "view" && (
                <div className="view-section">
                    {Object.keys(newspapers).length === 0 ? (
                        <p>No editions found</p>
                    ) : (
                        Object.entries(newspapers).map(([date, data]) => (
                            <div key={date} className="edition-card">
                                <h3>
                                    {date} — {data.title}
                                </h3>
                                {data.pages.map((page, idx) => (
                                    <div key={idx} className="page-preview">
                                        <h5>Page {idx + 1}</h5>
                                        {page.startsWith("data:application/pdf") ? (
                                            <embed
                                                src={page}
                                                type="application/pdf"
                                                width="100%"
                                                height="400px"
                                            />
                                        ) : (
                                            <img
                                                src={page}
                                                alt={`Page ${idx + 1}`}
                                                style={{ maxWidth: "100%" }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// ========== MAIN EXPORT ==========
export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <div className="App">
            {!isAdmin ? (
                <AdminLogin onLogin={() => setIsAdmin(true)} />
            ) : (
                <AdminPanel onLogout={() => setIsAdmin(false)} />
            )}
        </div>
    );
}
