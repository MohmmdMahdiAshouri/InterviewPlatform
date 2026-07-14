import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/interview", "/problem", "/role-request", "/admin", "/my-problems", "/my-interviews"];

export function middleware(request: NextRequest) {
    const hasRefreshToken = request.cookies.has("refreshToken");
    const isProtected = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path),
    );

    if (isProtected && !hasRefreshToken) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/interview/:path*",
        "/problem/:path*",
        "/role-request/:path*",
        "/admin/:path*",
        "/my-problems/:path*",
        "/my-interviews/:path*",
    ],
};
