import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMusicBgs = query({
  handler: async (ctx) => {
    const musics = await ctx.db.query("musicBackground").first();
    return musics;
  },
});
export const create = mutation({
  args: {
    musicId: v.id("music"),
  },
  handler: async (ctx, args) => {
    const musics = await ctx.db.query("musicBackground").first();
    if (!musics) {
      return null;
    }
    await ctx.db.delete(musics._id);
    const music = await ctx.db.insert("musicBackground", {
      music: args.musicId,
    });
    return music;
  },
});
