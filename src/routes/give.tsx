import { createFileRoute } from "@tanstack/react-router";
import { GivePage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/give")({
  head: () => ({ meta: pageMeta("Give | Burning Bush Ministries International", "Learn how to support the ministry and community work of Burning Bush Ministries International.") }),
  component: GivePage,
});