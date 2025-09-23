import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import { db, storage } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState("insert");
  const [editions, setEditions] = useState([]);
  const [form, setForm] = useState({ date: "", title: "", files: [] });
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState([]);

  // Load editions from Firestore
  const loadEditions = async () => {
    const q = query(collection(db, "editions"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEditions(data);
  };

  // Load contacts from Firestore
  const loadContacts = async () => {
    const snapshot = await getDocs(collection(db, "contacts"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setContacts(data);
  };

  useEffect(() => {
    loadEditions();
    loadContacts();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  // Upload files to Firebase Storage and return their URLs
  const uploadPages = async (files, date) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `editions/${date}/page-${Date.now()}-${i}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  // INSERT
  const handleInsert = async (e) => {
  e.preventDefault();
  if (!form.date) return alert("Please select a date");
  if (form.files.length === 0) return alert("Please select files");

  // Upload pages to Storage
  const pageUrls = await uploadPages(form.files, form.date);

  const docRef = doc(db, "editions", form.date);
  await setDoc(docRef, { title: form.title, pages: pageUrls, date: form.date });

  setForm({ date: "", title: "", files: [] });
  showMessage("Edition inserted ✅");
  await loadEditions();

  // redirect to view
  setActiveTab("view");
};


  // UPDATE
  const handleUpdate = async (e) => {
  e.preventDefault();
  if (!form.date) return alert("Please select a date");
  const existing = editions.find(ed => ed.id === form.date);
  if (!existing) return alert("Edition not found");

  let pageUrls = existing.pages || [];
  if (form.files.length > 0) {
    const uploaded = await uploadPages(form.files, form.date);
    pageUrls = [...pageUrls, ...uploaded];
  }

  const docRef = doc(db, "editions", form.date);
  await updateDoc(docRef, { title: form.title, pages: pageUrls });

  setForm({ date: "", title: "", files: [] });
  showMessage("Edition updated ✏");
  await loadEditions();

  // redirect to view
  setActiveTab("view");
};


  // DELETE
  const handleDelete = async (date) => {
  const docRef = doc(db, "editions", date);
  await deleteDoc(docRef);
  showMessage("Edition deleted 🗑");
  await loadEditions();
  setActiveTab("view");
};


  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo">PC</div>
          <div className="brand-text">
            <h3>PharmaCare</h3>
            <small>Admin</small>
          </div>
        </div>


        <nav className="admin-nav">
          {["insert", "update", "delete", "view", "contacts"].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="admin-logout">
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </aside>


      <main className="admin-main">
        <header className="admin-header">
          <h1>📰 Newspaper Admin Panel</h1>
          <div className="kv">{message || "Manage editions in the cloud"}</div>
        </header>

        <section className="table-section">
          {/* INSERT FORM */}
          {activeTab === "insert" && (
            <form className="form-card" onSubmit={handleInsert}>
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              <label>Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <label>Upload Pages</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={e => setForm({ ...form, files: Array.from(e.target.files) })}
              />
              {form.files.length > 0 && (
                <div>
                  <strong>Selected files:</strong>
                  <ul>
                    {form.files.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="btn" type="submit">Insert Edition</button>
            </form>
          )}

          {/* UPDATE FORM */}
          {activeTab === "update" && (
            <form className="form-card" onSubmit={handleUpdate}>
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => {
                const date = e.target.value;
                const existing = editions.find(ed => ed.id === date);
                if (existing) setForm({ date, title: existing.title, files: [] });
                else setForm({ date, title: "", files: [] });
              }} required />
              {form.date && (
                <>
                  <label>Title</label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <label>Add More Pages</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={e => setForm({ ...form, files: Array.from(e.target.files) })}
                  />
                  {form.files.length > 0 && (
                    <div>
                      <strong>Selected files:</strong>
                      <ul>
                        {form.files.map((file, idx) => (
                          <li key={idx}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button className="btn" type="submit">Update Edition</button>
                </>
              )}
            </form>
          )}

          {/* DELETE */}
          {activeTab === "delete" && (
            <div className="view-section">
              {editions.map(ed => (
                <div key={ed.id} className="edition-card">
                  <h3>{ed.date} — {ed.title}</h3>
                  <button className="btn danger" onClick={() => handleDelete(ed.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}

          {/* VIEW */}
          {activeTab === "view" && (
            <div className="view-section">
              {editions.map(ed => (
                <div key={ed.id} className="edition-card">
                  <h3>{ed.date} — {ed.title}</h3>
                  {ed.pages && ed.pages.map((p, idx) => (
                    <div key={idx}>
                      {p.endsWith(".pdf") ? (
                        <embed src={p} type="application/pdf" width="100%" height="300px" />
                      ) : (
                        <img src={p} alt={`Page ${idx + 1}`} style={{ maxWidth: "100%" }} />
                      )}
                    </div>
                  ))}
                  <button className="btn small" onClick={() => { setActiveTab("update"); setForm({ date: ed.date, title: ed.title, files: [] }); }}>Edit</button>
                  <button className="btn small danger" onClick={() => handleDelete(ed.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === "contacts" && (
            <div className="view-section">
              <h2>Contact Messages</h2>
              {contacts.length === 0 ? (
                <p>No contacts received.</p>
              ) : (
                contacts.map(contact => (
                  <div key={contact.id} className="edition-card">
                    <strong>{contact.name}</strong> ({contact.email})
                    <p>{contact.message}</p>
                    <small>
                      {contact.timestamp
                        ? new Date(contact.timestamp.seconds * 1000).toLocaleString()
                        : ""}
                    </small>
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


