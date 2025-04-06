import React, { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber, db, ref, get } from "../firebase-config";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  }, []);

  const checkUserExists = async (phoneNumber) => {
    const formattedPhone = phoneNumber.replace("+91", ""); // Remove +91 if present
    const userRef = ref(db, `users/${formattedPhone}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  };

  const sendOtp = async () => {
    if (!phone.match(/^\d{10}$/)) {
      setMessage("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      const exists = await checkUserExists(phone);
      if (!exists) {
        setMessage("Phone number is not registered.");
        return;
      }

      const fullPhoneNumber = `+91${phone}`; // Add +91 for OTP
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      setVerificationId(confirmation.verificationId);
      setMessage("OTP sent successfully.");
    } catch (error) {
      setMessage("Error sending OTP: " + error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!verificationId) {
        setMessage("Please request OTP first.");
        return;
      }

      const credential = await auth.signInWithCredential(auth.PhoneAuthProvider.credential(verificationId, otp));
      setMessage("Phone number verified successfully!");
      console.log("User:", credential.user);
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Phone Authentication</h2>
      <input
        type="text"
        placeholder="Enter phone number (10 digits)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>

      {verificationId && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      <div id="recaptcha-container"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PhoneAuth;
