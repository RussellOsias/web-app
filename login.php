<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firebase Auth</title>
</head>
<body>
  <h1>Register/Login</h1>
  <form id="authForm">
    <input type="email" id="email" placeholder="Email" required />
    <input type="password" id="password" placeholder="Password" required />
    <button type="submit">Register</button>
    <button type="button" id="loginButton">Login</button>
  </form>

  <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"></script>
  <script>
    // Your Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBm8iwu-P2TtA_e-Rf_O0SbuXZKediI_8g",
      authDomain: "info-be84d.firebaseapp.com",
      projectId: "info-be84d",
      storageBucket: "info-be84d.firebasestorage.app",
      messagingSenderId: "583701069126",
      appId: "1:583701069126:web:58a3b08685c35e577a3947",
      measurementId: "G-162JGKGL3L"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Register user
    document.getElementById('authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          alert("User registered successfully!");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });

    // Login user
    document.getElementById('loginButton').addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          alert("Logged in successfully!");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  </script>
</body>
</html>