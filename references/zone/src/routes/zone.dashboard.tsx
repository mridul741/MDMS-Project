import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/mdms/dashboard";
export const Route = createFileRoute("/zone/dashboard")({
  head: () => ({
    meta: [
      { title: "Zone Dashboard | MDMS" },
      {
        name: "description",
        content: "Monitor meter performance and electricity usage across Mangalore Zone.",
      },
      { property: "og:title", content: "Zone Dashboard | MDMS" },
      {
        property: "og:description",
        content: "Monitor meter performance and electricity usage across Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Dashboard />;
}
