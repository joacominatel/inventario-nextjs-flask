import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // create response for request with jwt token
    if ((req.cookies as unknown as Record<string, string>).jwt) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect("/login");
    }
}