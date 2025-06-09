import { auth, db, doc, getDoc, updateDoc } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"; 

const profileEmail = document.getElementById("profileEmail");
const logoutButton = document.getElementById("logoutButton");
const mfaToggleSwitch = document.getElementById("mfaToggleSwitch");2

onAuthStateChanged(auth, async (user) => {
  if (user) {
    profileEmail.textContent = user.email;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const mfaEnabled = userDocSnap.exists() ? userDocSnap.data().mfaEnabled || false : false;
    mfaToggleSwitch.checked = mfaEnabled;
    logoutButton.classList.remove("hidden");
  } else {
    window.location.href = "index.html";
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
});

mfaToggleSwitch.addEventListener("change", async () => {
  const user = auth.currentUser;
  if (!user) return alert("No user logged in.");

  const userDocRef = doc(db, "users", user.uid);
  const enableMFA = mfaToggleSwitch.checked;

  try {
    await updateDoc(userDocRef, { mfaEnabled: enableMFA });
    alert(`MFA is now ${enableMFA ? "enabled" : "disabled"}`);
  } catch (error) {
    alert("Failed to update MFA status: " + error.message);
  }
});