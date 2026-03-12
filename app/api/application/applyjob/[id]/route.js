import { NextResponse } from "next/server";
import Application from "@/models/Application";
import Job from "@/models/Job";
import connectDB from "@/utils/db";
import { authenticateUser } from "@/lib/auth"; // Your JWT logic

export async function POST(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;   // 👈 MUST await just like your GET example

        // Authenticate user (same as middleware)
        const userId = await authenticateUser();
        if (!userId) {
            return NextResponse.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            );
        }

        // 1️⃣ Check if already applied
        const alreadyApplied = await Application.findOne({
            job: id,
            applicant: userId,
        });

        if (alreadyApplied) {
            return NextResponse.json(
                {
                    message: "You have already applied for this job",
                    success: false,
                },
                { status: 400 }
            );
        }

        // 2️⃣ Check if job exists
        const job = await Job.findById(id);
        if (!job) {
            return NextResponse.json(
                {
                    message: "Job not found",
                    success: false,
                },
                { status: 404 }
            );
        }

        // 3️⃣ Create a new application entry
        const application = await Application.create({
            job: id,
            applicant: userId,
        });

        // 4️⃣ Push application into job's applications array
        job.applications.push(application._id);
        await job.save();

        return NextResponse.json(
            {
                message: "Job applied successfully.",
                success: true,
            },
            { status: 201 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "Server error",
                success: false,
            },
            { status: 500 }
        );
    }
}
