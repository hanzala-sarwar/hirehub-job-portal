import { NextResponse } from "next/server";
import Application from "@/models/Application";
import connectDB from "@/utils/db";
import { authenticateUser } from "@/lib/auth";

export async function PUT(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;   // applicationId

        // Authenticate user (Employer/Admin)
        const userId = await authenticateUser();
        if (!userId) {
            return NextResponse.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            );
        }

        // Read request body
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json(
                { message: "Status is required", success: false },
                { status: 400 }
            );
        }

        // Find the application
        const application = await Application.findOne({ _id: id });
        if (!application) {
            return NextResponse.json(
                { message: "Application not found", success: false },
                { status: 404 }
            );
        }

        // Update status
        application.status = status.toLowerCase();
        await application.save();

        return NextResponse.json(
            {
                message: "Status updated successfully",
                success: true
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Server error", success: false },
            { status: 500 }
        );
    }
}
