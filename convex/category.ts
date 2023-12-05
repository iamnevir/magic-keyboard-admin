import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("category").order("asc").collect();
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
    imageUrl: v.string(),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.insert("category", {
      name: args.name,
      imageUrl: args.imageUrl,
      slug: args.slug,
      description: args.description,
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
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    collections: v.optional(v.array(v.id("collection"))),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const category = await ctx.db.patch(args.id, {
      ...rest,
    });
    return category;
  },
});
export const removeAll = mutation({
  args: {
    id: v.array(v.id("category")),
  },
  handler: async (ctx, args) => {
    const categories = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return categories;
  },
});
export const getcategoryBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("category")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    return post;
  },
});
