import { internalQuery, mutation, query } from "./_generated/server";
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
    products: v.array(v.id("product")),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.insert("collection", {
      name: args.name,
      categoryId: args.categoryId,
      products: args.products,
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
    products: v.array(v.id("product")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const category = await ctx.db.patch(args.id, {
      ...rest,
    });
    return category;
  },
});
