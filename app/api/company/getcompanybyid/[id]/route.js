import connectDB from "@/utils/db";
import Company from "@/models/Company";

export async function GET(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;   // 👈 MUST await

        const company = await Company.findById(id);

        if (!company) {
            return Response.json(
                { message: "Company not found.", success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { company, success: true },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Server error", success: false },
            { status: 500 }
        );
    }
}
