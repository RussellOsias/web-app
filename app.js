import { auth, db, doc, getDoc, updateDoc } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"; 

const loginForm = document.getElementById("loginForm");
let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    window.location.href = "dashboard.html";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const mfaEnabled = userDocSnap.exists() ? userDocSnap.data().mfaEnabled || false : false;

    if (!mfaEnabled) {
      return window.location.href = "dashboard.html";
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    await updateDoc(userDocRef, { otp });

    // Send OTP
    const response = await fetch("sendOTP.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("otpEmail", email);
      window.location.href = "verify-email.html";
    } else {
      alert("Failed to send OTP. Please try again.");
    }

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});