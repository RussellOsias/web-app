import { auth, db, doc, getDoc } from "./firebase-config.js";

window.verifyOTP = async () => {
  const enteredOtp = document.getElementById("otpInput").value.trim();
  const email = localStorage.getItem("otpEmail");

  if (!enteredOtp || !email) {
    alert("Please enter the OTP.");
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, "dummy-password"); // dummy PW
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return alert("User not found in database.");
    }

    const storedOtp = userDocSnap.data().otp;
    if (storedOtp && storedOtp === parseInt(enteredOtp)) {
      localStorage.removeItem("otpEmail");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid OTP. Try again.");
    }
  } catch (error) {
    console.error("Verification failed:", error);
    alert("Verification failed: " + error.message);
  }
};