// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZD0FiX_dTO8iojw4R1W95Ybk75V0sIag",
  authDomain: "info-efb6b.firebaseapp.com",
  databaseURL: "https://info-efb6b-default-rtdb.firebaseio.com",
  projectId: "info-efb6b",
  storageBucket: "info-efb6b.appspot.com",
  messagingSenderId: "8141133981",
  appId: "1:8141133981:web:a01a544d206acffd199c74",
  measurementId: "G-9T38NLDXKL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
