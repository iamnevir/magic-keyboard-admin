import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getvouchers = query({
  handler: async (ctx) => {
    const vouchers = await ctx.db.query("voucher").order("desc").collect();
    return vouchers;
  },
});

export const getvoucherById = query({
  args: {
    voucherId: v.id("voucher"),
  },
  handler: async (ctx, args) => {
    const voucher = await ctx.db.get(args.voucherId);
    return voucher;
  },
});
export const create = mutation({
  args: {
    code: v.string(),
    time: v.optional(v.number()),
    type: v.string(),
    percent: v.optional(v.number()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const vouchers = await ctx.db.insert("voucher", {
      code: args.code,
      time: args.time,
      type: args.code,
      percent: args.percent,
      price: args.price,
    });
    return vouchers;
  },
});
export const remove = mutation({
  args: {
    id: v.id("voucher"),
  },
  handler: async (ctx, args) => {
    const vouchers = await ctx.db.delete(args.id);
    return vouchers;
  },
});
export const getVoucherByCode = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const voucher = await ctx.db
      .query("voucher")
      .filter((q) => q.eq(q.field("code"), args.code))
      .unique();
    return voucher;
  },
});
export const getVoucherByType = query({
  args: {
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const voucher = await ctx.db
      .query("voucher")
      .filter((q) => q.eq(q.field("type"), args.type))
      .unique();
    return voucher;
  },
});
export const update = mutation({
  args: {
    id: v.id("voucher"),
    code: v.string(),
    time: v.optional(v.number()),
    type: v.string(),
    percent: v.optional(v.number()),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const vouchers = await ctx.db.patch(args.id, {
      ...rest,
    });
    return vouchers;
  },
});
export const removeAll = mutation({
  args: {
    id: v.array(v.id("voucher")),
  },
  handler: async (ctx, args) => {
    const vouchers = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return vouchers;
  },
});
