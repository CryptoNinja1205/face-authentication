"use client";
import WebcamCapture from "@/components/webcamCapture";
import React, { useState } from "react";

const FaceAuthComponent = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between sign up and sign in

  const handleCapture = async (image: string) => {
    const action = isSignUp ? "signup" : "signin"; // Determine action based on state
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, faceFeatures: image, action }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp); // Toggle between sign up and sign in
    setMessage(""); // Clear the message on toggle
    setEmail(""); // Clear the email on toggle
  };

  return (
    <div>
      <h1>{isSignUp ? "Sign Up" : "Sign In"} with Face Authentication</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <WebcamCapture onCapture={handleCapture} />
      <button onClick={toggleAuthMode}>
        Switch to {isSignUp ? "Sign In" : "Sign Up"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FaceAuthComponent;
