import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMusics = query({
  handler: async (ctx) => {
    const musics = await ctx.db.query("music").order("desc").collect();
    return musics;
  },
});
export const getMusicById = query({
  args: {
    musicId: v.id("music"),
  },
  handler: async (ctx, args) => {
    const music = await ctx.db.get(args.musicId);
    return music;
  },
});
export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const music = await ctx.db.insert("music", {
      name: args.name,
      url: args.url,
    });
    return music;
  },
});
export const remove = mutation({
  args: {
    id: v.id("music"),
  },
  handler: async (ctx, args) => {
    const music = await ctx.db.delete(args.id);
    return music;
  },
});
export const update = mutation({
  args: {
    id: v.id("music"),
    name: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const music = await ctx.db.patch(args.id, {
      ...rest,
    });
    return music;
  },
});
export const removeAll = mutation({
  args: {
    id: v.array(v.id("music")),
  },
  handler: async (ctx, args) => {
    const musics = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return musics;
  },
});
