import { NextResponse } from "next/server";
import Job from "@/models/Job";
import connectDB from "@/utils/db";
import { authenticateUser } from "@/lib/auth";  // If you use token-based auth
import Company from "@/models/Company";

export async function GET(req) {
    try {
        await connectDB();

        // ✔ get admin user from auth helper
        const user = await authenticateUser();
        // console.log("userId",user);


        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        const adminId = user; // same as req.id in Express

        // const jobs = await Job.find({ created_by: adminId }).sort({ createdAt: -1 });

        //   const jobs = await Job.find({ created_by: adminId }).populate({
        //     path:'company',
        //     createdAt:-1
        // });

        const jobs = await Job.find({ created_by: adminId })
            .sort({ createdAt: -1 })
            .populate('company');


        console.log(jobs);


        if (!jobs || jobs.length === 0) {
            return NextResponse.json(
                { message: "Jobs not found.", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                jobs,
                success: true,
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
