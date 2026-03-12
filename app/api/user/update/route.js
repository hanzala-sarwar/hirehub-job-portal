import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/User";
import { authenticateUser } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs"; // required for large files

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  try {
    await connectDB();

    // Authenticate user
    const userId = await authenticateUser();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const fullname = formData.get("fullname");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const bio = formData.get("bio");
    const skills = formData.get("skills");
    const file = formData.get("file"); // resume PDF

    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update basic fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = skills.split(",").map((s) => s.trim());
    }

    // ----------------------------------------
    // ⭐ CLOUDINARY UPLOAD STREAM (LARGE FILES)
    // ----------------------------------------
    if (file && typeof file === "object") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const cloudinaryUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "auto",
            chunk_size: 6_000_000, // 6MB chunks
            timeout: 120000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      // Save Cloudinary uploaded URL
      user.profile.resume = cloudinaryUpload.secure_url;
      user.profile.resumeOriginalName = file.name;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
