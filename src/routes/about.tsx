import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("About | Burning Bush Ministries International", "Discover the story, vision, mission, and values of Burning Bush Ministries International in Meru, Kenya.") }),
  component: AboutPage,
});