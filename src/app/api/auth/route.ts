import { db } from "../../lib/db"; // Create a User model
import {
  compareFaceFeatures,
  hashFaceFeatures,
} from "../../../utils/faceUtils"; // Utility functions
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest, res: NextResponse) {
  const { email, faceFeatures, action } = await req.json();
  const User = db.Users;
  if (action === "signup") {
    const hashedFeatures = hashFaceFeatures(faceFeatures);
    const newUser = new User({ email: email, faceFeatures: hashedFeatures });
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User created successfully!" }),
      { status: 201 }
    );
  }
  if (action === "signin") {
    const user = await User.findOne({ email });
    if (!user) return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );

    const isMatch = compareFaceFeatures(faceFeatures, user.faceFeatures);
    if (!isMatch)
      return new NextResponse(
        JSON.stringify({ message: "Face not recognized" }),
        { status: 401 }
      );

    return new NextResponse(
      JSON.stringify({ message: "Sign in successfully!" }),
      { status: 200 }
    );
  }

  return new NextResponse(JSON.stringify({ message: "Face not recognized" }), {
    status: 401,
  });
}
