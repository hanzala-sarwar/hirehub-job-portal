import { NextResponse } from "next/server";
import Job from "@/models/Job";
import connectDB from "@/utils/db";
import { authenticateUser } from "@/lib/auth"; // Your JWT auth
import Application from "@/models/Application";
import User from "@/models/User";

export async function GET(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;   // jobId

        // Authenticate user (admin or employer)
        const userId = await authenticateUser();
        if (!userId) {
            return NextResponse.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            );
        }

        // Find job + populate applications and applicants
        const job = await Job.findById(id).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
            },
        });

        if (!job) {
            return NextResponse.json(
                { message: "Job not found.", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                job,
                success: true,
            },
            { status: 200 }
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
