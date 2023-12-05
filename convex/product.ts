import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("product").order("desc").collect();
    return products;
  },
});
export const getMoreProducts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("product")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
export const getProductsByCategory = query({
  args: {
    categoryId: v.id("category"),
  },
  handler: async (ctx, args) => {
    const collections = await ctx.db
      .query("collection")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    const productsList = collections.map(
      async (collection) =>
        await ctx.db
          .query("product")
          .withIndex("by_category", (q) => q.eq("collectionId", collection._id))
          .order("desc")
          .collect()
    );
    const products = productsList.reduce(
      (accumulator, currentPromise) =>
        accumulator.then((results) =>
          currentPromise.then((result) => results.concat(result))
        ),
      Promise.resolve([])
    );
    return products;
  },
});

export const getProductsByCollection = query({
  args: {
    collectionId: v.id("collection"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("product")
      .withIndex("by_category", (q) => q.eq("collectionId", args.collectionId))
      .order("desc")
      .collect();
    return products;
  },
});

export const getProductsByIds = query({
  args: {
    productIdList: v.array(v.id("product")),
  },
  handler: async (ctx, args) => {
    const products = args.productIdList.map(async (e) => await ctx.db.get(e));
    return products;
  },
});

export const getProductById = query({
  args: {
    productId: v.id("product"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.get(args.productId);
    return products;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    producer: v.optional(v.string()),
    description: v.optional(v.any()),
    infomation: v.optional(v.any()),
    price: v.optional(v.number()),
    pay: v.optional(v.string()),
    isSale: v.optional(v.boolean()),
    salePrice: v.optional(v.number()),
    timeSale: v.optional(v.number()),
    quantity: v.optional(v.number()),
    collectionId: v.id("collection"),
    options: v.optional(
      v.array(
        v.object({
          name: v.string(),
          option: v.array(
            v.object({
              name: v.string(),
              image: v.optional(v.string()),
              price: v.optional(v.number()),
              quantity: v.optional(v.number()),
            })
          ),
        })
      )
    ),
    images: v.optional(v.array(v.string())),
    isPublish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.insert("product", {
      name: args.name,
      slug: args.slug,
      producer: args.producer,
      description: args.description,
      infomation: args.infomation,
      price: args.price,
      pay: args.pay,
      isSale: args.isSale,
      salePrice: args.salePrice,
      timeSale: args.timeSale,
      quantity: args.quantity,
      collectionId: args.collectionId,
      options: args.options,
      images: args.images,
      isPublish: args.isPublish,
    });
    return products;
  },
});
export const remove = mutation({
  args: {
    id: v.id("product"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.delete(args.id);
    return products;
  },
});
export const update = mutation({
  args: {
    id: v.id("product"),
    name: v.string(),
    slug: v.string(),
    producer: v.optional(v.string()),
    description: v.optional(v.any()),
    infomation: v.optional(v.any()),
    price: v.optional(v.number()),
    isSale: v.optional(v.boolean()),
    salePrice: v.optional(v.number()),
    timeSale: v.optional(v.number()),
    pay: v.optional(v.string()),
    quantity: v.optional(v.number()),
    collectionId: v.id("collection"),
    options: v.optional(
      v.array(
        v.object({
          name: v.string(),
          option: v.array(
            v.object({
              name: v.string(),
              image: v.optional(v.string()),
              price: v.optional(v.number()),
              quantity: v.optional(v.number()),
            })
          ),
        })
      )
    ),
    images: v.optional(v.array(v.string())),
    isPublish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const products = await ctx.db.patch(args.id, {
      ...rest,
    });
    return products;
  },
});
export const removeAll = mutation({
  args: {
    id: v.array(v.id("product")),
  },
  handler: async (ctx, args) => {
    const products = args.id.forEach(async (id) => {
      await ctx.db.delete(id);
    });

    return products;
  },
});
export const getProductBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("product")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    return product;
  },
});
