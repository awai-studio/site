import { NextResponse } from "next/server";

export function middleware(request) {
  const authHeader = request.headers.get("authorization");

  console.log(authHeader);

  return NextResponse.next();
}

