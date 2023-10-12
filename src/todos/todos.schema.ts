import { z } from "zod";

export const TodoDTOSchema = z.object({
  id: z.string(),
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title should not be empty"),
  isCompleted: z.boolean().default(false),
  isStarred: z.boolean().default(false),
});

export type TodoInsertSchema = z.infer<typeof TodoDTOSchema>;
export type TodoSelectSchema = Omit<TodoInsertSchema, "id">;
