// Import Firebase modules and auth instance
import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
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
const authForm = document.getElementById('authForm');
const loginButton = document.getElementById('loginButton');
const forgotPasswordButton = document.getElementById('forgotPasswordButton');
const logoutButton = document.getElementById('logoutButton');
const profileSection = document.getElementById('profileSection');
const profileEmail = document.getElementById('profileEmail');
const googleLoginButton = document.getElementById('googleLoginButton');
const testRedirectButton = document.getElementById('testRedirectButton');

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed. User:", user); // Log the user object

  if (user) {
    console.log("User is signed in:", user.email);
    console.log("Redirecting to dashboard...");

    try {
      // Add a small delay before redirection
      setTimeout(() => {
        console.log("Executing window.location.href = 'dashboard.html';");
        window.location.href = "dashboard.html";
      }, 500); // 500ms delay
    } catch (error) {
      console.error("Redirection failed:", error);
      alert("An error occurred while redirecting. Please try again.");
    }
  } else {
    console.log("User is signed out");
    // Show login form if user is signed out
    authForm.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    profileSection.classList.add('hidden');
  }
});

// Register User
authForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Attempting to register with:", email, password);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      console.log("User registered successfully:", user.email);

      // Save additional user data to Firestore
      return setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date()
      });
    })
    .then(() => {
      alert("User registered successfully!");
    })
    .catch((error) => {
      console.error("Registration failed:", error);
      alert("Error: " + error.message);
    });
});

// Login User
loginButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Attempting to log in with:", email, password);

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("Login successful. Redirecting to dashboard...");
      setTimeout(() => {
        console.log("Executing window.location.href = 'dashboard.html';");
        window.location.href = "dashboard.html";
      }, 500); // 500ms delay
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
    .then(() => {
      console.log("Redirecting to dashboard...");
      setTimeout(() => {
        console.log("Executing window.location.href = 'dashboard.html';");
        window.location.href = "dashboard.html";
      }, 500); // 500ms delay
    })
    .catch((error) => {
      console.error("Google login failed:", error);
      alert("Error: " + error.message);
    });
});

// Forgot Password
forgotPasswordButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;

  console.log("Attempting to send password reset email to:", email);

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
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

// Test Redirect Button
testRedirectButton.addEventListener('click', () => {
  console.log("Testing redirection...");
  try {
    console.log("Executing window.location.href = 'dashboard.html';");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Redirection failed:", error);
    alert("An error occurred while redirecting. Please try again.");
  }
});