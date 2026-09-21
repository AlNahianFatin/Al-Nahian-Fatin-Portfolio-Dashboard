import { NextResponse } from "next/server";
import { authenticate, issueTokens } from "../../../../lib/auth";
import { AppError } from "../../../../lib/error-handler";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const admin = await authenticate(
      email,
      password
    );

    const { access, refresh } =
      await issueTokens(admin.id);

    const response = NextResponse.json({
      message: "Login successful",
    });

    response.cookies.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refresh_token", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  }
  catch (error: any) {
    console.error(error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
          field: error.field,
        },
        {
          status: error.statusCode,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
        field: "general",
      },
      {
        status: 500,
      }
    );
  }
}