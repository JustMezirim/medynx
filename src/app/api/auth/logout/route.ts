import { NextResponse } from "next/server"

async function logout() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"))

  // Clear the authentication cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })

  return response
}

export async function POST() {
  return logout()
}

export async function GET() {
  return logout()
}
