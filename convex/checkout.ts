import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getcheckouts = query({
  handler: async (ctx) => {
    const checkouts = await ctx.db.query("checkout").order("desc").collect();
    return checkouts;
  },
});

export const getcheckoutById = query({
  args: {
    checkoutId: v.id("checkout"),
  },
  handler: async (ctx, args) => {
    const checkout = await ctx.db.get(args.checkoutId);
    return checkout;
  },
});
export const remove = mutation({
  args: {
    id: v.id("checkout"),
  },
  handler: async (ctx, args) => {
    const checkout = await ctx.db.delete(args.id);
    return checkout;
  },
});

export const removeAll = mutation({
  args: {
    id: v.array(v.id("checkout")),
  },
  handler: async (ctx, args) => {
    const checkouts = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return checkouts;
  },
});
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
export const create = mutation({
  args: {
    image: v.id("_storage"),
    orderId: v.id("order"),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("checkout", {
      orderId: args.orderId,
      image: args.image,
      accept: args.accept,
    });
  },
});
export const getImage = query({
  args: { image: v.id("_storage") },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.image);
    return imageUrl;
  },
});
export const getcheckoutByOrder = query({
  args: {
    orderId: v.id("order"),
  },
  handler: async (ctx, args) => {
    const checkout = await ctx.db
      .query("checkout")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();
    return checkout;
  },
});
export const deleteById = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});
export const update = mutation({
  args: {
    id: v.id("checkout"),
    accept: v.optional(v.boolean()),
    image: v.optional(v.id("_storage")),
    orderId: v.optional(v.id("order")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const checkout = await ctx.db.patch(args.id, {
      ...rest,
    });
    return checkout;
  },
});
