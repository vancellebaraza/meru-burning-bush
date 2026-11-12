import { createFileRoute } from "@tanstack/react-router";
import { LeadershipPage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/leadership")({
  head: () => ({ meta: pageMeta("Leadership | Burning Bush Ministries International", "Meet the ministry board and local church pastors serving the Burning Bush Ministries International family.") }),
  component: LeadershipPage,
});