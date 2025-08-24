import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/about", "/contact", "/login", "/register"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const payload = await verifyToken(token)

    // Check if doctor account is approved
    if (payload.role === "doctor") {
      await connectDB()
      const user = await User.findById(payload.userId)
      if (user && !user.isActive) {
        // Only allow access to pending page for unapproved doctors
        if (pathname !== "/dashboard/doctor/pending") {
          return NextResponse.redirect(new URL("/dashboard/doctor/pending", request.url))
        }
        return NextResponse.next()
      }
    }

    // Role-based access control
    if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/patient", request.url))
    }

    if (pathname.startsWith("/dashboard/doctor") && payload.role !== "doctor") {
      return NextResponse.redirect(new URL("/dashboard/patient", request.url))
    }

    if (pathname.startsWith("/dashboard/patient") && payload.role !== "patient") {
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url))
      } else if (payload.role === "doctor") {
        return NextResponse.redirect(new URL("/dashboard/doctor", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"  
  ],
}
