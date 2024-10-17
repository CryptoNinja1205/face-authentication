import {db} from '../../lib/db'; // Create a User model
import { compareFaceFeatures, hashFaceFeatures } from '../../../utils/faceUtils'; // Utility functions
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { method } = req;

  if (method === 'POST') {
    const { email, faceFeatures, action } = req.body;
    const User = db.Users
    if (action === 'signup') {
      const hashedFeatures = hashFaceFeatures(faceFeatures);
      const newUser = new User({ email, faceFeatures: hashedFeatures });
      await newUser.save();
      return res.status(201).json({ message: 'User created successfully!' });
    }
    if (action === 'signin') {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
  
        const isMatch = compareFaceFeatures(faceFeatures, user.faceFeatures);
        if (!isMatch) return res.status(401).json({ message: 'Face not recognized' });
  
        return res.status(200).json({ message: 'Sign-in successful!' });
      }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
