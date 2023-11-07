import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("category").order("desc").collect();
    return categories;
  },
});
export const getCategoryById = query({
  args: {
    categoryId: v.id("category"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    return category;
  },
});
export const create = mutation({
  args: {
    name: v.string(),
    collections: v.array(v.id("collection")),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.insert("category", {
      name: args.name,
      collections: args.collections,
    });
    return category;
  },
});
export const remove = mutation({
  args: {
    id: v.id("category"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.delete(args.id);
    return category;
  },
});
export const update = mutation({
  args: {
    id: v.id("category"),
    name: v.string(),
    collections: v.array(v.id("collection")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const category = await ctx.db.patch(args.id, {
      ...rest,
    });
    return category;
  },
});
