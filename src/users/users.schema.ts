import { z } from "zod";

export const UserDTOSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name should not be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be valid" }),
});

export const UserInsertDTOSchema = UserDTOSchema.omit({ id: true })
  .extend({
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .trim(),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserSelectSchema = z.infer<typeof UserDTOSchema>;
export type UserInsertSchema = z.infer<typeof UserInsertDTOSchema>;
