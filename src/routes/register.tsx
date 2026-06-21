import { createFileRoute, redirect } from "@tanstack/react-router";

// LIFF Endpoint URL is set to /register in LINE Developers Console
// Redirect to the registration form at /
export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => null,
});
