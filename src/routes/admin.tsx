import { Outlet, createFileRoute } from "@tanstack/react-router";

// Layout for everything under /admin. It deliberately does not use SiteLayout, so the public
// header and footer never appear here, and it keeps every admin page out of search results.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Burning Bush Ministries International" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  // Admin screens depend on the browser-only session, so the server renders no admin content.
  ssr: false,
  component: Outlet,
});
