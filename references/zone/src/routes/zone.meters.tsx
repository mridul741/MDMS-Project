import { createFileRoute } from "@tanstack/react-router";
import { MeterManagement } from "@/features/mdms/meters";
export const Route = createFileRoute("/zone/meters")({
  validateSearch: (search: Record<string, unknown>): { add?: boolean } =>
    search["add"] === true || search["add"] === "true" ? { add: true } : {},
  head: () => ({
    meta: [
      { title: "Meter Management | MDMS" },
      {
        name: "description",
        content: "Browse and inspect smart meters assigned to Mangalore Zone.",
      },
      { property: "og:title", content: "Meter Management | MDMS" },
      {
        property: "og:description",
        content: "Browse and inspect smart meters assigned to Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const { add } = Route.useSearch();
  return <MeterManagement initialAdd={add ?? false} />;
}
