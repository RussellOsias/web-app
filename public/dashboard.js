import { auth, database } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// DOM Elements
const profileEmail = document.getElementById("profileEmail");
const logoutButton = document.getElementById("logoutButton");
const mfaToggleSwitch = document.getElementById("mfaToggleSwitch");

// Handle Authentication State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is signed in:", user.email);

    // Display user's email
    profileEmail.textContent = user.email;

    // Check if MFA is enabled in the database
    const mfaStatusRef = ref(database, `users/${user.uid}/mfaEnabled`);
    try {
      const snapshot = await get(mfaStatusRef);
      const mfaEnabled = snapshot.exists() ? snapshot.val() : false;
      console.log("MFA status retrieved from database:", mfaEnabled);

      // Update MFA toggle switch state
      mfaToggleSwitch.checked = mfaEnabled;

      // Show logout button
      logoutButton.classList.remove("hidden");
    } catch (error) {
      console.error("Failed to retrieve MFA status from database:", error);
      alert("Error retrieving MFA status: " + error.message);
    }
  } else {
    console.log("User is signed out");
    window.location.href = "index.html";
  }
});

// Logout User
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully.");
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to login page
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Error: " + error.message);
  }
});

// MFA Toggle Switch
mfaToggleSwitch.addEventListener("change", async (e) => {
  const user = auth.currentUser;

  if (!user) {
    alert("No user is currently logged in.");
    return;
  }

  try {
    const mfaStatusRef = ref(database, `users/${user.uid}/mfaEnabled`);

    if (e.target.checked) {
      // Enable MFA by sending an email verification link
      await sendEmailVerification(user);
      console.log("Email verification link sent to:", user.email);
      alert("An email verification link has been sent to your email. Please verify your email to enable MFA.");

      // Update MFA status in the database
      await set(mfaStatusRef, true);
      console.log("MFA enabled in database for user:", user.uid);
    } else {
      // Disable MFA (logically)
      alert("MFA has been disabled. You will no longer require email verification during login.");

      // Update MFA status in the database
      await set(mfaStatusRef, false);
      console.log("MFA disabled in database for user:", user.uid);
    }
  } catch (error) {
    console.error("Failed to update MFA status:", error);
    alert("Error: " + error.message);
  }
});