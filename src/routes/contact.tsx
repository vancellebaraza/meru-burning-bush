import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta("Contact | Burning Bush Ministries International", "Get in touch or plan a visit to Burning Bush Ministries International, Mwiteria, Meru, Kenya.") }),
  component: ContactPage,
});