import connectDB from "@/utils/db";
import Company from "@/models/Company";
import { authenticateUser } from "@/lib/auth";

export async function POST(req) {
    try {
        await connectDB();

        // Authenticate user (same as your other routes)
        const userId = await authenticateUser();
        console.log(userId);
        
        if (!userId) {
            return Response.json(
                { message: "User not authenticated", success: false },
                { status: 401 }
            );
        }

        const { companyName } = await req.json();

        if (!companyName) {
            return Response.json(
                { message: "Company name is required.", success: false },
                { status: 400 }
            );
        }

        // Check if company already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return Response.json(
                { message: "⚠️ This company already exist.", success: false },
                { status: 400 }
            );
        }

        // Create new company
        company = await Company.create({
            name: companyName,
            userId: userId,
        });

        return Response.json(
            {
                message: "Company registered successfully.",
                company,
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
