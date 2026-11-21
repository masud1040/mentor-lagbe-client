import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "mentorlagbe_fallback_jwt_secret_change_in_env";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    const user = session.user as {
      id: string;
      name: string;
      email: string;
      role?: string;
      isPremium?: boolean;
    };

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role || "student",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({
      success: true,
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "student",
        isPremium: Boolean(user.isPremium),
      },
    });
  } catch (error) {
    console.error("JWT Issue Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate JWT token" },
      { status: 500 }
    );
  }
}