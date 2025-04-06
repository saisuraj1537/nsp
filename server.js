require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

const app = express();
app.use(cors());
app.use(express.json());



// ✅ Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sample-a028e-default-rtdb.firebaseio.com/", // 🔹 Replace with your Firebase project URL
  });
} 

const db = admin.database();

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Generate JWT after successful Google login
app.post("/generateToken", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    // ✅ Fetch users from Realtime Database
    const usersRef = db.ref("users");
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    // ✅ Check if the email exists in any user's data
    let emailExists = false;
    if (users) {
      Object.values(users).forEach((user) => {
        if (user.email === userEmail) {
          emailExists = true;
        }
      });
    }

    if (!emailExists) {
      return res.status(403).json({ error: "Unauthorized user. Contact admin." });
    }

    // ✅ Generate JWT token (valid for 1 hour)
    const token = jwt.sign({ email: userEmail }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: "Invalid Firebase Token" });
  }
});

// ✅ Middleware to verify JWT token
const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access Denied" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid Token" });

    req.user = decoded;
    next();
  });
};
app.post("/verifyUser", async (req, res) => {
  const { email, mobileNumber } = req.body;

  try {
    const userSnapshot = await db.ref("users").orderByChild("email").equalTo(email).once("value");

    if (userSnapshot.exists()) {
      let userData = null;
      userSnapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.phone === mobileNumber) {
          userData = data;
        }
      });

      if (userData) {
        const token = jwt.sign({ email, phone: mobileNumber }, SECRET_KEY, { expiresIn: "10h" });
        return res.json({ verified: true, token });
      }
    }

    return res.status(401).json({ verified: false, error: "User not found or details do not match." });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Verify JWT token endpoint
app.post("/verifyToken", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Access Denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Invalid or expired token" });
  }
});

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy"); // Remove COOP header
  next();
});



// ✅ Example Protected Route
app.get("/protected", verifyJWT, (req, res) => {
  res.json({ message: "Access Granted", user: req.user });
});

app.listen(5000, () => console.log("Server running on port 5000"));
