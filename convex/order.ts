import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getorder = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("order").order("desc").collect();
    return orders;
  },
});
export const getorderById = query({
  args: {
    orderId: v.id("order"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    return order;
  },
});
export const getOrderByUserId = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      const order = await ctx.db
        .query("order")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .collect();
      return order;
    }
    return null;
  },
});
export const create = mutation({
  args: {
    userId: v.optional(v.string()),
    phone: v.string(),
    name: v.string(),
    address: v.string(),
    payment: v.string(),
    totalPrice: v.number(),
    isPaid: v.boolean(),
    code: v.string(),
    orderStatus: v.optional(v.string()),
    orderItems: v.array(
      v.object({
        product: v.id("product"),
        image: v.optional(v.string()),
        quantity: v.number(),
        price: v.number(),
        option: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.insert("order", {
      userId: args.userId,
      phone: args.phone,
      address: args.address,
      totalPrice: args.totalPrice,
      isPaid: args.isPaid,
      orderItems: args.orderItems,
      code: args.code,
      payment: args.payment,
      name: args.name,
    });
    return orders;
  },
});
export const remove = mutation({
  args: {
    id: v.id("order"),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.delete(args.id);
    return orders;
  },
});
export const update = mutation({
  args: {
    id: v.id("order"),
    userId: v.optional(v.string()),
    phone: v.optional(v.string()),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    payment: v.optional(v.string()),
    totalPrice: v.optional(v.number()),
    isPaid: v.optional(v.boolean()),
    code: v.optional(v.string()),
    orderStatus: v.optional(v.string()),
    orderItems: v.optional(
      v.array(
        v.object({
          product: v.id("product"),
          image: v.optional(v.string()),
          quantity: v.number(),
          price: v.number(),
          option: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const orders = await ctx.db.patch(args.id, {
      ...rest,
    });
    return orders;
  },
});
export const removeAll = mutation({
  args: {
    id: v.array(v.id("order")),
  },
  handler: async (ctx, args) => {
    const orders = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return orders;
  },
});
