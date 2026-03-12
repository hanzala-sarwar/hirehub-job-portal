import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Job from "@/models/Job";

export const runtime = "nodejs";

export async function PUT(req, context) {
  try {
    await connectDB();

    // ✅ Next.js 16 safe params
    const { id } = await context.params;

    // ✅ JSON body (no formData needed)
    const body = await req.json();

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = body;

    // ✅ Convert requirements string → array
    const requirementsArray =
      typeof requirements === "string"
        ? requirements.split(",").map(r => r.trim())
        : [];

    const updateData = {
      title,
      description,
      requirements: requirementsArray,
      salary,
      location,
      jobType,
      experience,
      position,
      company: companyId, // 👈 important
    };

    const job = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("company");

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job updated successfully",
        job,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
