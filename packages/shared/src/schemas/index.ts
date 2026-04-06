import { z } from "zod";

// Add shared Zod schemas here
export const emailSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

export type EmailInput = z.infer<typeof emailSchema>;
