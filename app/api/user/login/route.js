import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/utils/db";

export async function POST(req) {
    try {
        await connectDB();

        const { email, password, role } = await req.json();

        // Validate required fields
        if (!email || !password || !role) {
            return NextResponse.json(
                { success: false, message: "Something is missing" },
                { status: 400 }
            );
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Incorrect email or password." },
                { status: 400 }
            );
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Incorrect email or password." },
                { status: 400 }
            );
        }

        // Validate role
        if (role !== user.role) {
            return NextResponse.json(
                { success: false, message: "Account doesn't exist with current role." },
                { status: 400 }
            );
        }

        // JWT token payload
        const tokenData = { userId: user._id };

        // Create JWT
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        // Remove password before sending response
        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        // Prepare response
        const res = NextResponse.json(
            {
                success: true,
                message: `Welcome back ${user.fullname}`,
                user: userData,
            },
            { status: 200 }
        );

        // Set HTTP-only cookie
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return res;

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
