import { createFileRoute } from "@tanstack/react-router";
import { Alerts } from "@/features/mdms/analytics";
export const Route = createFileRoute("/zone/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts & Notifications | MDMS" },
      {
        name: "description",
        content: "Review critical meter alerts and abnormal consumption in Mangalore Zone.",
      },
      { property: "og:title", content: "Alerts & Notifications | MDMS" },
      {
        property: "og:description",
        content: "Review critical meter alerts and abnormal consumption in Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Alerts />;
}
