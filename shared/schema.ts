import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const diagnosisRequests = pgTable("diagnosis_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  primarySymptom: text("primary_symptom").notNull(),
  associatedSymptoms: text("associated_symptoms").array(),
  age: integer("age"),
  gender: text("gender"),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDiagnosisRequestSchema = createInsertSchema(diagnosisRequests).pick({
  primarySymptom: true,
  associatedSymptoms: true,
  age: true,
  gender: true,
});

export const diagnosisInputSchema = z.object({
  primarySymptom: z.string().min(1, "Primary symptom is required"),
  associatedSymptoms: z.array(z.string()).optional().default([]),
  age: z.number().min(1).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDiagnosisRequest = z.infer<typeof insertDiagnosisRequestSchema>;
export type DiagnosisRequest = typeof diagnosisRequests.$inferSelect;
export type DiagnosisInput = z.infer<typeof diagnosisInputSchema>;

export interface DiagnosisResult {
  condition: string;
  probability: number;
  explanation: string;
  urgency: "urgent" | "moderate" | "mild";
  matchingSymptoms: string[];
  recommendations: string[];
}

export interface DiagnosisResponse {
  summary: string;
  results: DiagnosisResult[];
  recommendations: string[];
  analysisTimestamp: string;
}
