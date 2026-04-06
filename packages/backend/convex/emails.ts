import { v } from "convex/values";

import { internalQuery, mutation } from "./_generated/server";

export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emails")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) return null;

    await ctx.db.insert("emails", {
      email: args.email,
      name: args.name,
      createdAt: Date.now(),
    });

    return null;
  },
});

export const list = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("emails").order("desc").take(100);
  },
});
