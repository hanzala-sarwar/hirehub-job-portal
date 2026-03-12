import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = NextResponse.json(
            {
                success: true,
                message: "Logged out successfully.",
            },
            { status: 200 }
        );

        // Clear the cookie
        res.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0), // Immediately expire
            path: "/",
        });

        return res;

    } catch (error) {
        console.log("LOGOUT ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
