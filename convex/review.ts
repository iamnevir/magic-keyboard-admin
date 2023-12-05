import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getReviewsWithPagination = query({
  args: {
    paginationOpts: paginationOptsValidator,
    productId: v.id("product"),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("review")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .order("desc")
      .paginate(args.paginationOpts);
    return reviews;
  },
});
export const getReviewsByProduct = query({
  args: {
    productId: v.id("product"),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("review")
      .withIndex("by_productId", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
    return reviews;
  },
});
export const getreviewById = query({
  args: {
    reviewId: v.id("review"),
  },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    return review;
  },
});
export const create = mutation({
  args: {
    productId: v.id("product"),
    userName: v.optional(v.string()),
    email: v.string(),
    rating: v.number(),
    title: v.optional(v.string()),
    comments: v.string(),
    images: v.optional(v.array(v.string())),
    like: v.optional(v.number()),
    dislike: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const review = await ctx.db.insert("review", {
      productId: args.productId,
      userName: args.userName,
      email: args.email,
      rating: args.rating,
      title: args.title,
      comments: args.comments,
      images: args.images,
      like: args.like,
      dislike: args.dislike,
    });
    return review;
  },
});
export const update = mutation({
  args: {
    id: v.id("review"),
    like: v.optional(v.number()),
    dislike: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const billboards = await ctx.db.patch(args.id, {
      ...rest,
    });
    return billboards;
  },
});
