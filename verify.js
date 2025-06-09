import { auth, db, doc, getDoc, updateDoc } from "./firebase-config.js";

window.verifyOTP = async () => {
  const enteredOtp = document.getElementById("otpInput").value.trim();

  if (!enteredOtp) {
    alert("Please enter the OTP.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("No authenticated user found. Please login again.");
    window.location.href = "index.html"; // redirect to login page
    return;
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User not found in database.");
      return;
    }

    const storedOtp = userDocSnap.data().otp;
    if (storedOtp && storedOtp.toString() === enteredOtp) {
      // OTP matches: clear OTP and mark verified
      await updateDoc(userDocRef, { otp: null });
      sessionStorage.setItem("otpVerified_" + user.uid, "true");
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
