import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  emails: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
