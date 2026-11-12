import { createFileRoute } from "@tanstack/react-router";
import { SermonsPage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/sermons")({
  head: () => ({ meta: pageMeta("Sermons | Burning Bush Ministries International", "Listen and grow with messages and teachings from Burning Bush Ministries International in Meru, Kenya.") }),
  component: SermonsPage,
});