# 🧠 Pharmacare Admin Panel

A modern, responsive **Admin Dashboard** built using **React + Firebase** for managing digital magazine editions (insert, update, delete, and view PDFs or images).  
The UI follows a **clean glassmorphism design**, optimized for both desktop and mobile views.

---

## 🚀 Features

✅ Add new editions with file uploads (images or PDFs)  
✅ Update existing editions by adding new pages  
✅ Delete editions along with all uploaded files  
✅ View uploaded pages inside the panel  
✅ Fully integrated with Firebase Firestore & Storage  
✅ Responsive design (works smoothly on mobile)  
✅ Clean modern UI using CSS (glassmorphism look)

---

## 🏗️ Tech Stack

- **Frontend:** React.js  
- **Backend / Database:** Firebase Firestore  
- **Storage:** Firebase Storage  
- **Styling:** Pure CSS (custom responsive layout)  

---

## 📁 Project Structure
pharmacare-admin/
│
├── src/
│ ├── firebase.js # Firebase configuration & setup
│ ├── AdminPanel.jsx # Main admin dashboard logic
│ ├── AdminPanel.css # Styling for the dashboard
│ ├── App.jsx # Root React component
│ └── index.js # Entry point
│
├── public/
│ └── index.html
│
├── package.json
├── README.md
└── .gitignore


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/pharmacare-admin.git
cd pharmacare-admin

2️⃣ Install Dependencies
npm install

3️⃣ Firebase Setup

Go to Firebase Console

Create a new project (or use an existing one)

Enable Firestore Database and Storage

Copy your Firebase config and paste it inside src/firebase.js:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

4️⃣ Run Locally
npm run dev


Then open: http://localhost:5173

🧩 Firebase Rules Example

Firestore Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /editions/{editionId} {
      allow read, write: if request.auth != null;
    }
  }
}


Storage Rules:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /editions/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

📸 Screenshots
Desktop View	Mobile View

	

(Add your actual screenshots in the /screenshots folder)

🧑‍💻 Author

👤 Manjit Bajaj
💼 GitHub Profile

📧 Contact: youremail@example.com

📜 License

This project is open-source under the MIT License.
You’re free to use, modify, and distribute this project.

🌟 Support

If you like this project, don’t forget to ⭐ star the repo and share it!


---

Would you like me to tailor the README a bit more — for example, include a **live demo link**, your **college/hackathon project description**, or **screenshots placeholders styled for GitHub** (like banners and badges)?

