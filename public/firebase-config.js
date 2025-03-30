import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZD0FiX_dTO8iojw4R1W95Ybk75V0sIag",
  authDomain: "info-efb6b.firebaseapp.com",
  projectId: "info-efb6b",
  storageBucket: "info-efb6b.firebasestorage.app",
  messagingSenderId: "8141133981",
  appId: "1:8141133981:web:a01a544d206acffd199c74",
  measurementId: "G-9T38NLDXKL",
  databaseURL: "https://info-efb6b-default-rtdb.firebaseio.com", // Add your Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and database instances
export const auth = getAuth(app);
export const database = getDatabase(app);