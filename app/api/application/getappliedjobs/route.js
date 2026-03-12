import { NextResponse } from "next/server";
import Application from "@/models/Application";
import connectDB from "@/utils/db";
import { authenticateUser } from "@/lib/auth";
import Job from "@/models/Job";
import Company from "@/models/Company";

export async function GET(req) {
    try {
        await connectDB();

        // Authenticate user
        const userId = await authenticateUser();
        if (!userId) {
            return NextResponse.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            );
        }

        // Find applications for this user
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "company",
                    options: { sort: { createdAt: -1 } },
                },
            });

        if (!applications || applications.length === 0) {
            return NextResponse.json(
                {
                    message: "No Applications found",
                    success: false,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                applications,
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
