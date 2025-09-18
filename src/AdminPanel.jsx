import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

export default function AdminPanel({ onLogout }) {
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
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo">PC</div>
          <div className="brand-text">
            <h3>PharmaCare</h3>
            <small>Admin</small>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={activeTab === "insert" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("insert")}
          >
            Insert
          </button>
          <button
            className={activeTab === "update" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("update")}
          >
            Update
          </button>
          <button
            className={activeTab === "delete" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("delete")}
          >
            Delete
          </button>
          <button
            className={activeTab === "view" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("view")}
          >
            View
          </button>
        </nav>

        <div className="admin-logout">
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>📰 Newspaper Admin Panel</h1>
            <p className="subtle">Manage editions — insert, update, delete and preview.</p>
          </div>
          <div className="header-actions">
            <div className="kv">{message ? message : "All changes saved locally"}</div>
          </div>
        </header>

        {/* Content area */}
        <section className="table-section">
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

              <div style={{ marginTop: 12 }}>
                <button className="btn" type="submit">
                  Insert Edition
                </button>
              </div>
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
                        <embed src={page} type="application/pdf" width="100%" height="200px" />
                      ) : (
                        <img src={page} alt={`Page ${idx + 1}`} style={{ maxWidth: "220px" }} />
                      )}

                      <div className="page-actions">
                        <label className="replace-btn">
                          Replace
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const results = await convertFilesToBase64(e.target.files);
                              const newPages = [...form.pages];
                              newPages[idx] = results[0];
                              setForm({ ...form, pages: newPages });
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          className="btn danger"
                          onClick={() => {
                            const newPages = form.pages.filter((_, i) => i !== idx);
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

              <div style={{ marginTop: 12 }}>
                <button className="btn" type="submit">
                  Update Edition
                </button>
              </div>
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

              <div style={{ marginTop: 12 }}>
                <button className="btn danger" type="submit">
                  Delete Edition
                </button>
              </div>
            </form>
          )}

          {/* VIEW */}
          {activeTab === "view" && (
            <div className="view-section">
              {Object.keys(newspapers).length === 0 ? (
                <p className="subtle">No editions found</p>
              ) : (
                Object.entries(newspapers)
                  .sort((a, b) => (a[0] < b[0] ? 1 : -1)) // show recent first
                  .map(([date, data]) => (
                    <div key={date} className="edition-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ marginBottom: 8 }}>
                          {date} — {data.title}
                        </h3>
                        <div>
                          <button
                            className="btn small"
                            onClick={() => {
                              // quick load into update form
                              setActiveTab("update");
                              setForm({ date, title: data.title, pages: [...data.pages] });
                              showMessage("Loaded edition into Update tab");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn small danger"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              const updated = { ...newspapers };
                              delete updated[date];
                              saveToStorage(updated);
                              showMessage("Edition removed");
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {data.pages.map((page, idx) => (
                        <div key={idx} className="page-preview" style={{ marginTop: 12 }}>
                          <h5>Page {idx + 1}</h5>
                          {page.startsWith("data:application/pdf") ? (
                            <embed src={page} type="application/pdf" width="100%" height="400px" />
                          ) : (
                            <img src={page} alt={`Page ${idx + 1}`} style={{ maxWidth: "100%" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
