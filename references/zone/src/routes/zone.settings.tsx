import { createFileRoute } from "@tanstack/react-router";
import { ZoneSettings } from "@/features/mdms/analytics";
export const Route = createFileRoute("/zone/settings")({
  head: () => ({
    meta: [
      { title: "Zone Settings | MDMS" },
      {
        name: "description",
        content:
          "Configure alert threshold and notification preference previews for Mangalore Zone.",
      },
      { property: "og:title", content: "Zone Settings | MDMS" },
      {
        property: "og:description",
        content:
          "Configure alert threshold and notification preference previews for Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <ZoneSettings />;
}
