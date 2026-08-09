import { NextResponse } from "next/server";
import { updateAuthSession } from "@/lib/supabase/authProxy";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Awai Studio"',
    },
  });
}

function validateBasicAuth(request) {
  const validUser = process.env.BASIC_AUTH_USER;
  const validPassword = process.env.BASIC_AUTH_PASSWORD;

  if (!validUser || !validPassword) return unauthorized();

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return unauthorized();

  const [authType, encodedCredentials] = authHeader.split(" ");
  if (authType !== "Basic" || !encodedCredentials) return unauthorized();

  try {
    const credential = atob(encodedCredentials);
    const separatorIndex = credential.indexOf(":");
    if (separatorIndex === -1) return unauthorized();

    const user = credential.slice(0, separatorIndex);
    const password = credential.slice(separatorIndex + 1);

    if (user !== validUser || password !== validPassword) return unauthorized();
    return null;
  } catch {
    return unauthorized();
  }
}

export async function proxy(request) {
  const basicAuthError = validateBasicAuth(request);
  if (basicAuthError) return basicAuthError;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateAuthSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
