import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBillboard = query({
  handler: async (ctx) => {
    const billboards = await ctx.db.query("billboard").order("desc").collect();
    return billboards;
  },
});
export const getBillboardById = query({
  args: {
    billboardId: v.id("billboard"),
  },
  handler: async (ctx, args) => {
    const billboard = await ctx.db.get(args.billboardId);
    return billboard;
  },
});
export const create = mutation({
  args: {
    producer: v.string(),
    title: v.string(),
    subTitle: v.optional(v.string()),
    imageUrl: v.string(),
    order: v.optional(v.string()),
    url: v.optional(v.string()),
    isPublish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const billboards = await ctx.db.insert("billboard", {
      producer: args.producer,
      title: args.title,
      subTitle: args.subTitle,
      imageUrl: args.imageUrl,
      order: args.order,
      url: args.url,
      isPublish: args.isPublish,
    });
    return billboards;
  },
});
export const remove = mutation({
  args: {
    id: v.id("billboard"),
  },
  handler: async (ctx, args) => {
    const billboards = await ctx.db.delete(args.id);
    return billboards;
  },
});
export const update = mutation({
  args: {
    id: v.id("billboard"),
    producer: v.string(),
    title: v.string(),
    subTitle: v.optional(v.string()),
    imageUrl: v.string(),
    order: v.optional(v.string()),
    url: v.optional(v.string()),
    isPublish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const billboards = await ctx.db.patch(args.id, {
      ...rest,
    });
    return billboards;
  },
});
