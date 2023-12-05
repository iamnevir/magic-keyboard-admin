import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCollections = query({
  handler: async (ctx) => {
    const collections = await ctx.db
      .query("collection")
      .order("desc")
      .collect();
    return collections;
  },
});

export const getCollectionsByCategory = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("category")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    if (!category) {
      return null;
    }
    const collections = await ctx.db
      .query("collection")
      .withIndex("by_category", (q) => q.eq("categoryId", category._id))
      .collect();
    return collections;
  },
});
export const getCollectionById = query({
  args: {
    collectionId: v.id("collection"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    return collection;
  },
});
export const create = mutation({
  args: {
    name: v.string(),
    categoryId: v.id("category"),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.insert("collection", {
      name: args.name,
      categoryId: args.categoryId,
      slug: args.slug,
      description: args.description,
    });
    return collection;
  },
});

export const remove = mutation({
  args: {
    id: v.id("collection"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.delete(args.id);
    return collection;
  },
});
export const update = mutation({
  args: {
    id: v.id("collection"),
    name: v.string(),
    categoryId: v.id("category"),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    products: v.optional(v.array(v.id("product"))),
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
    id: v.array(v.id("collection")),
  },
  handler: async (ctx, args) => {
    const categories = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return categories;
  },
});
export const getcollectionBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("collection")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    return post;
  },
});
