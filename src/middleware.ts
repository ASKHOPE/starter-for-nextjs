import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;
  const session = cookies.get("a_session_church")?.value;

  // Define public routes
  const isPublicRoute = pathname === "/login";
  // Static assets and API routes should be bypassed
  const isStaticAsset = pathname.startsWith("/_") || pathname.includes(".");

  if (isStaticAsset) {
    return next();
  }

  if (!session && !isPublicRoute) {
    return redirect("/login");
  }

  if (session && isPublicRoute) {
    return redirect("/");
  }

  return next();
});
