import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const fullname = formData.get("fullname");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const password = formData.get("password");
    const role = formData.get("role");
    const file = formData.get("file");

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let profilePhoto = null;

    // Upload image only if file exists
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "profiles",
            resource_type: "auto",
            chunk_size: 10_000_000, // 10MB
            timeout: 300000,        // 5 minutes
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      profilePhoto = uploadResult.secure_url;
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto },
    });

    return NextResponse.json({ success: true, message: "Account created successfully." }, { status: 201 });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
