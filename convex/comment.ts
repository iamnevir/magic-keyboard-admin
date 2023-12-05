import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCommentByPost = query({
  args: {
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comment")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
    return comments;
  },
});
export const getCommentById = query({
  args: {
    commentId: v.id("comment"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    return comment;
  },
});
export const create = mutation({
  args: {
    postId: v.id("post"),
    name: v.string(),
    email: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.insert("comment", {
      postId: args.postId,
      name: args.name,
      email: args.email,
      content: args.content,
    });
    return comment;
  },
});
