'use client'
import WebcamCapture from "@/components/webcamCapture";
import React, { useState } from "react";

const FaceAuthComponent = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleCapture = async (image: string) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, faceFeatures: image, action: "signin" }), // Change action as needed
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Face Authentication</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <WebcamCapture onCapture={handleCapture} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default FaceAuthComponent;
