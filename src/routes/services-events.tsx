import { createFileRoute } from "@tanstack/react-router";
import { ServicesEventsPage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/services-events")({
  head: () => ({ meta: pageMeta("Services & Events | Burning Bush Ministries International", "Find weekly worship, prayer, fellowship programmes, and upcoming church events in Meru, Kenya.") }),
  component: ServicesEventsPage,
});