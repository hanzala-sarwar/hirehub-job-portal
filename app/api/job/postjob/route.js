import connectDB from "@/utils/db";
import Job from "@/models/Job";
import { authenticateUser } from "@/lib/auth";

export async function POST(req) {
    try {
        await connectDB();

        // Authenticate the logged-in admin
        const userId = await authenticateUser();
        if (!userId) {
            return Response.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            );
        }

        const body = await req.json();
        console.log(body);
        
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

        // Validate required fields
        if (
            !title ||
            !description ||
            !requirements ||
            !salary ||
            !location ||
            !jobType ||
            !experience ||
            !position ||
            !companyId
        ) {
            return Response.json(
                { message: "Something is missing.", success: false },
                { status: 400 }
            );
        }

        // Create job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(r => r.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
        });

        return Response.json(
            {
                message: "New job created successfully.",
                job,
                success: true,
            },
            { status: 201 }
        );

    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Server error", success: false },
            { status: 500 }
        );
    }
}
