// app.js
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// Google Provider
const googleProvider = new GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const googleLoginButton = document.getElementById('googleLoginButton');
const logoutButton = document.getElementById('logoutButton');
const profileSection = document.getElementById('profileSection');
const profileEmail = document.getElementById('profileEmail');

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email);

    // Show profile section
    profileSection.classList.remove('hidden');
    profileEmail.textContent = user.email;

    // Hide login form and show logout button
    loginForm.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    console.log("User is signed out");

    // Show login form and hide profile section
    loginForm.classList.remove('hidden');
    profileSection.classList.add('hidden');
    logoutButton.classList.add('hidden');
  }
});

// Login User
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Attempting to log in with:", email, password);

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("Login successful.");
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Error: " + error.message);
    });
});

// Login with Google
googleLoginButton.addEventListener('click', () => {
  console.log("Attempting to log in with Google...");

  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;

      console.log("Logged in with Google successfully:", user.email);

      // Save additional user data to Firestore
      return setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName || "No Name",
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      });
    })
    .catch((error) => {
      console.error("Google login failed:", error);
      alert("Error: " + error.message);
    });
});

// Logout User
logoutButton.addEventListener('click', () => {
  console.log("Attempting to log out...");

  signOut(auth)
    .then(() => {
      console.log("User logged out successfully.");
      alert("Logged out successfully!");
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      alert("Error: " + error.message);
    });
});