"use client";
import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import WebcamCapture from "../components/webcamCapture";

const Home: React.FC = () => {
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Path to your models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelLoaded(true);
    };

    loadModels();
  }, []);

  const handleCapture = async (imageSrc: string) => {
    const imgElement = new Image();
    imgElement.src = imageSrc;

    imgElement.onload = async () => {
      const detections = await faceapi
        .detectSingleFace(imgElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        console.log(detections);
        // Implement authentication logic by comparing descriptors
      } else {
        console.log("No face detected");
      }
    };
  };
  return (
    <div>
      <h1>Face Authentication</h1>
      {modelLoaded ? (
        <WebcamCapture onCapture={handleCapture} />
      ) : (
        <p>Loading models...</p>
      )}
    </div>
  );
};

export default Home;
