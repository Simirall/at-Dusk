import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const sessionSearchSchema = z.object({
  session: z.string().uuid(),
});

export const Route = createFileRoute("/login/_layout/getToken")({
  validateSearch: sessionSearchSchema,
});
