import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"; 
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"; 
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyAZD0FiX_dTO8iojw4R1W95Ybk75V0sIag",
  authDomain: "info-efb6b.firebaseapp.com",
  projectId: "info-efb6b",
  storageBucket: "info-efb6b.firebasestorage.app",
  messagingSenderId: "8141133981",
  appId: "1:8141133981:web:a01a544d206acffd199c74"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, getDoc, setDoc, updateDoc };