import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  handleProtectedRoutes,
  handleSignInRoutes,
} from "@/services/middleware/auth/protectedRoute";
import protectedLoginRoutes from "@/shared/data/protected-routes/protectedLoginRoutes";
import protectedUserRoutes from "@/shared/data/protected-routes/protectedUserRoutes";

export const middleware = async (request: NextRequest) => {
  const userResponse = await handleProtectedRoutes(
    request,
    protectedUserRoutes,
  );
  if (userResponse) return userResponse;

  const signinResponse = await handleSignInRoutes(
    request,
    protectedLoginRoutes,
  );
  if (signinResponse) return signinResponse;

  return NextResponse.next();
};
