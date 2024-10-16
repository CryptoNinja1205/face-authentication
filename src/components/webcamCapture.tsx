"use client";
import React, { useRef, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (image: Blob) => void; // Change to accept image Blob
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startVideo();

    return () => {
      // Cleanup stream on component unmount
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg")
        );
        console.log("=========>", imageBlob);
        if (imageBlob) {
          onCapture(imageBlob); // Pass the image blob to the parent component
        }
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <button onClick={handleCapture}>Capture</button>
    </div>
  );
};

export default WebcamCapture;

// import React, { useRef, useEffect } from 'react';
// import { loadFaceApiModels, detectFace } from '../utils/faceApi';

// const CaptureButton: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const initializeCamera = async () => {
//       await loadFaceApiModels();
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     };

//     initializeCamera();

//     return () => {
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);

//   const handleCapture = async () => {
//     if (videoRef.current) {
//       const imageCapture = new ImageCapture(videoRef.current.srcObject.getVideoTracks()[0]);
//       const imageBitmap = await imageCapture.grabFrame();
//       // Process the imageBitmap for face detection...
//       await detectFace(imageBitmap);
//     }
//   };

//   return (
//     <div>
//       <video ref={videoRef} autoPlay style={{ display: 'none' }} />
//       <button onClick={handleCapture}>Capture</button>
//     </div>
//   );
// };

// export default CaptureButton;
