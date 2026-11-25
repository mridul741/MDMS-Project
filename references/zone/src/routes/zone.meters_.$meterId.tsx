import { createFileRoute } from "@tanstack/react-router";
import { MeterDetails } from "@/features/mdms/meters";
export const Route = createFileRoute("/zone/meters_/$meterId")({
  head: () => ({
    meta: [
      { title: "Meter Details | MDMS" },
      {
        name: "description",
        content: "Inspect meter information and recent readings in Mangalore Zone.",
      },
      { property: "og:title", content: "Meter Details | MDMS" },
      {
        property: "og:description",
        content: "Inspect meter information and recent readings in Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const { meterId } = Route.useParams();
  return <MeterDetails meterId={meterId} />;
}
