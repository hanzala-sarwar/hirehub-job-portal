import { NextResponse } from "next/server";
import Job from "@/models/Job";
import connectDB from "@/utils/db";
// import { authenticateUser } from "@/lib/auth"; // If you are using middleware-style auth
import Application from "@/models/Application";

export async function GET(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;   // 👈 MUST await

        // Authenticate user (same as your Express middleware)
        // const userId = await authenticateUser();
        // if (!userId) {
        //     return Response.json(
        //         { message: "User not authenticated", success: false },
        //         { status: 401 }
        //     );
        // }

        // Optional: you can add populate if needed
        // const job = await Job.findById(id);

        const job = await Job.findById(id).populate({
            path: "applications"
        });

        if (!job) {
            return NextResponse.json(
                {
                    message: "Job not found.",
                    success: false,
                },
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
