import { z } from "zod";

export const UserAuthDTOSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be valid" }),
  password: z.string({ required_error: "Password is required" }),
});

export type UserAuthSchema = z.infer<typeof UserAuthDTOSchema>;
export type UserSession = { sessionId: string; userId: string };
