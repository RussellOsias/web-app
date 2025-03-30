import { auth, database } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");

// Handle Authentication State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);

    // Check if MFA is enabled in the database
    const mfaStatusRef = ref(database, `users/${user.uid}/mfaEnabled`);
    try {
      const snapshot = await get(mfaStatusRef);
      const mfaEnabled = snapshot.exists() ? snapshot.val() : false;
      console.log("MFA status retrieved from database:", mfaEnabled);

      if (mfaEnabled) {
        alert("MFA is enabled. Please verify your email to log in.");

        // Send email verification link
        const actionCodeSettings = {
          url: window.location.href, // Redirect URL after email verification
          handleCodeInApp: true, // Ensure the link is handled in the app
        };

        try {
          await sendSignInLinkToEmail(auth, user.email, actionCodeSettings);
          console.log("Email verification link sent to:", user.email);
          alert(`A verification email has been sent to ${user.email}. Please check your inbox.`);
        } catch (error) {
          console.error("Failed to send email verification:", error);

          // Handle quota exceeded error
          if (error.code === "auth/quota-exceeded") {
            alert(
              "Error: Daily email quota exceeded. Please try again tomorrow or upgrade your Firebase plan."
            );
          } else {
            alert("Error sending email verification: " + error.message);
          }
        }

        // Log out the user until they verify their email
        await firebaseSignOut(auth);
        console.log("User logged out due to unverified email.");
        window.location.href = "index.html";
      } else {
        console.log("Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 500); // 500ms delay
      }
    } catch (error) {
      console.error("Failed to retrieve MFA status from database:", error);
      alert("Error retrieving MFA status: " + error.message);
    }
  } else {
    console.log("User is signed out");
  }
});

// Login User
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in successfully:", user.email);

    // Check if MFA is enabled in the database
    const mfaStatusRef = ref(database, `users/${user.uid}/mfaEnabled`);
    const snapshot = await get(mfaStatusRef);
    const mfaEnabled = snapshot.exists() ? snapshot.val() : false;
    console.log("MFA status retrieved from database:", mfaEnabled);

    if (mfaEnabled) {
      alert("MFA is enabled. Please verify your email to log in.");

      // Send email verification link
      const actionCodeSettings = {
        url: window.location.href, // Redirect URL after email verification
        handleCodeInApp: true, // Ensure the link is handled in the app
      };

      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        console.log("Email verification link sent to:", email);
        alert(`A verification email has been sent to ${email}. Please check your inbox.`);

        // Save email to localStorage for later use
        window.localStorage.setItem("emailForSignIn", email);
      } catch (error) {
        console.error("Failed to send email verification:", error);

        // Handle quota exceeded error
        if (error.code === "auth/quota-exceeded") {
          alert(
            "Error: Daily email quota exceeded. Please try again tomorrow or upgrade your Firebase plan."
          );
        } else {
          alert("Error sending email verification: " + error.message);
        }
      }

      // Log out the user until they verify their email
      await firebaseSignOut(auth);
      console.log("User logged out due to unverified email.");
    } else {
      console.log("Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500); // 500ms delay
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Error: " + error.message);
  }
});

// Handle Email Link Verification
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem("emailForSignIn");

  if (!email) {
    email = prompt("Please provide your email for confirmation:");
  }

  if (email) {
    try {
      // Complete sign-in with the email link
      await signInWithEmailLink(auth, email, window.location.href);
      console.log("Email verified successfully. User logged in:", email);
      alert("Email verified successfully. You are now logged in.");

      // Clear email from localStorage
      window.localStorage.removeItem("emailForSignIn");

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Email verification failed:", error);

      // Handle invalid action code error
      if (error.code === "auth/invalid-action-code") {
        alert(
          "Error: The email verification link is invalid, expired, or already used. Please request a new link."
        );
      } else {
        alert("Error verifying email: " + error.message);
      }
    }
  } else {
    console.error("No email found in localStorage or provided by the user.");
    alert("Error: No email found. Please log in again.");
    window.location.href = "index.html";
  }
}