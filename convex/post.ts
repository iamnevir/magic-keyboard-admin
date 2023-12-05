import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("post").order("desc").collect();
    return posts;
  },
});
export const getPostByType = query({
  args: {
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("post")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .collect();
    return posts;
  },
});
export const getpostById = query({
  args: {
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    return post;
  },
});
export const getpostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("post")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    return post;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subTitle: v.optional(v.string()),
    slug: v.string(),
    type: v.string(),
    author: v.string(),
    content: v.optional(v.any()),
    thumnail: v.string(),
    isPublish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.insert("post", {
      title: args.title,
      subTitle: args.subTitle,
      slug: args.slug,
      type: args.type,
      author: args.author,
      content: args.content,
      thumnail: args.thumnail,
      isPublish: args.isPublish,
    });
    return posts;
  },
});
export const remove = mutation({
  args: {
    id: v.id("post"),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.delete(args.id);
    return posts;
  },
});
export const update = mutation({
  args: {
    id: v.id("post"),
    title: v.string(),
    subTitle: v.optional(v.string()),
    slug: v.string(),
    type: v.string(),
    author: v.string(),
    content: v.optional(v.any()),
    thumnail: v.string(),
    isPublish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const posts = await ctx.db.patch(args.id, {
      ...rest,
    });
    return posts;
  },
});
export const removeAll = mutation({
  args: {
    id: v.array(v.id("post")),
  },
  handler: async (ctx, args) => {
    const posts = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return posts;
  },
});
