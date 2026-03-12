import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Company from "@/models/Company";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, context) {
  try {
    await connectDB();

    // ✅ Same as before (Next 16 safe)
    const { id } = await context.params;

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const website = formData.get("website");
    const location = formData.get("location");
    const file = formData.get("file");

    let logo = null;

    // ✅ EXACT same Cloudinary logic as REGISTER
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "company-logos",
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

      logo = uploadResult.secure_url;
    }

    const updateData = {
      name,
      description,
      website,
      location,
    };

    if (logo) {
      updateData.logo = logo;
    }

    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Company updated successfully",
        company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
