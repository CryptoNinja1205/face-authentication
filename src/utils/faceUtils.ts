import * as faceapi from 'face-api.js'; // Ensure you have this library installed

// Load models
export const loadModels = async (): Promise<void> => {
  const MODEL_URL = '/models'; // Change this to your model path
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
};

// Compare face features
export const compareFaceFeatures = async (capturedFace: string, storedFace: Float32Array): Promise<boolean> => {
  // Convert the base64 image to an HTMLImageElement
  const img = await faceapi.fetchImage(capturedFace);
  
  // Detect face and extract features
  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  
  if (!detections) return false; // No face detected
  
  const capturedDescriptor: Float32Array = detections.descriptor;
  
  // Compare with stored features (assuming storedFace is a Float32Array)
  const distance = faceapi.euclideanDistance(capturedDescriptor, storedFace);
  
  // Set a threshold for face recognition
  return distance < 0.6; // Adjust threshold as needed
};


export const hashFaceFeatures = async (image: string): Promise<Float32Array | null> => {
    // Convert the base64 image to an HTMLImageElement
    const img = await faceapi.fetchImage(image);
    
    // Detect face and extract features
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    return detections ? detections.descriptor : null; // Return the descriptor or null if no face is detected
  };