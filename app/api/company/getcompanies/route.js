import connectDB from "@/utils/db";
import  Company  from "@/models/Company";
import { authenticateUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    // Authenticate user
    const userId = await authenticateUser();
    if (!userId) {
      return Response.json(
        { message: "User not authenticated", success: false },
        { status: 401 }
      );
    }

    // Fetch companies created by logged in user
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return Response.json(
        { message: "Companies not found.", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        companies,
        success: true,
      },
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
