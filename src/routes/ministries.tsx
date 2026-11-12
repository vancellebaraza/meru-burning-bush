import { createFileRoute } from "@tanstack/react-router";
import { MinistriesPage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ministries")({
  head: () => ({ meta: pageMeta("Ministries | Burning Bush Ministries International", "Explore Children, Youth, Worship, Outreach, Bible Study, and Ministry of Helps at BBMI Meru.") }),
  component: MinistriesPage,
});