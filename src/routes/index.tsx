import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/church-pages";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta("Burning Bush Ministries International | Meru, Kenya", "Join a welcoming church family in Meru, Kenya. Teach the undiluted Word of God and develop leaders." ) }),
  component: HomePage,
});