import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage, AdminSkeleton } from "@/components/admin";

export const Route = createFileRoute("/admin/")({
  pendingComponent: AdminSkeleton,
  component: AdminDashboardPage,
});
