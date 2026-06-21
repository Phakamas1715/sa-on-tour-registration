import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

// LIFF Endpoint URL is set to /register in LINE Developers Console
// Redirect to the registration form at /
export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({
      g: z.string().optional(),
    }).parse(s),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/", search: { g: search.g }, replace: true });
  },
  component: () => null,
});
