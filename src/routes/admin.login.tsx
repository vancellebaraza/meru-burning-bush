import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginPage, AdminSkeleton } from "@/components/admin";

export const Route = createFileRoute("/admin/login")({
  pendingComponent: AdminSkeleton,
  component: AdminLoginPage,
});
