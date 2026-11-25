import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MDMS | Mangalore Zone Dashboard" },
      {
        name: "description",
        content: "Meter Data Management System for Mangalore Zone administrators.",
      },
      { property: "og:title", content: "MDMS | Mangalore Zone Dashboard" },
      {
        property: "og:description",
        content: "Monitor smart meters, customers, consumption and alerts in Mangalore Zone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/zone/dashboard" });
  },
});
