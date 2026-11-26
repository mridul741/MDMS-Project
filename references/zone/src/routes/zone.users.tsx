import { createFileRoute } from "@tanstack/react-router";
import { UserManagement } from "@/features/mdms/users";
export const Route = createFileRoute("/zone/users")({
  head: () => ({
    meta: [
      { title: "User Management | MDMS" },
      { name: "description", content: "View customers and their meters in Mangalore Zone." },
      { property: "og:title", content: "User Management | MDMS" },
      { property: "og:description", content: "View customers and their meters in Mangalore Zone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <UserManagement />;
}
