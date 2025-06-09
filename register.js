import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// DOM Elements
const registerForm = document.getElementById('registerForm');

// Register User
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User registered:", user.email);

    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date().toISOString()
    });

    // Send verification email
    await sendEmailVerification(user);

    alert("Registered! Check your email for verification.");
    window.location.href = "index.html";

  } catch (error) {
    console.error("Error registering:", error);
    alert("Error: " + error.message);
  }
});
