import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed", // /fr is default, /en is explicit
});

export const config = {
  matcher: ["/((?!admin|studio|api|_next|_vercel|.*\\..*).*)"],
};
