import connectDB from "@/utils/db";
import Job from "@/models/Job";
import Company from "@/models/Company";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword") || "";

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        };

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        // ✅ ALWAYS return 200
        return Response.json(
            { jobs, success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Server error", success: false },
            { status: 500 }
        );
    }
}
