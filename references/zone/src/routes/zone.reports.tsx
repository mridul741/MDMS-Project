import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/features/mdms/analytics";
export const Route = createFileRoute("/zone/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics | MDMS" },
      {
        name: "description",
        content: "Analyse energy consumption and meter performance in Mangalore Zone.",
      },
      { property: "og:title", content: "Reports & Analytics | MDMS" },
      {
        property: "og:description",
        content: "Analyse energy consumption and meter performance in Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Reports />;
}
