import { z } from "zod";

export const linkSchema = z.object({
  title: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  originalUrl: z.string().url("Vui lòng nhập đúng định dạng URL"),
  fallbackUrl: z
    .string()
    .url("Vui lòng nhập đúng định dạng URL")
    .optional()
    .or(z.literal("")),
  campaignId: z.string().nullable().optional(),
});

export type LinkFormData = z.infer<typeof linkSchema>;
