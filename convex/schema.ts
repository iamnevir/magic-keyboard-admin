import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  billboard: defineTable({
    producer: v.string(),
    title: v.string(),
    subTitle: v.optional(v.string()),
    imageUrl: v.string(),
    order: v.optional(v.string()),
    url: v.optional(v.string()),
    isPublish: v.boolean(),
  }).index("by_producer", ["producer"]),
  category: defineTable({
    name: v.string(),
    collections: v.optional(v.array(v.id("collection"))),
  }).index("by_name", ["name"]),
  collection: defineTable({
    name: v.string(),
    categoryId: v.id("category"),
    products: v.optional(v.array(v.id("product"))),
  }).index("by_category", ["categoryId"]),
  product: defineTable({
    name: v.string(),
    producer: v.optional(v.string()),
    description: v.optional(v.string()),
    productDetail: v.union(
      v.id("product_keyboard"),
      v.id("product_switch"),
      v.id("product_keycap")
    ),
    collectionId: v.id("collection"),
  }).index("by_collection", ["collectionId"]),
  product_keyboard: defineTable({
    productId: v.id("product"),
    price: v.optional(v.float64()),
    quantity: v.int64(),
    layout: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          image: v.id("image"),
        })
      )
    ),
    keycap: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          image: v.id("image"),
        })
      )
    ),
    switch: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          image: v.id("image"),
        })
      )
    ),
    color: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          image: v.id("image"),
        })
      )
    ),
  }).index("by_productId", ["productId"]),
  product_switch: defineTable({
    productId: v.id("product"),
    price: v.optional(v.float64()),
    quantity: v.int64(),
    option: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          image: v.id("image"),
        })
      )
    ),
    weight: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
        })
      )
    ),
  }).index("by_productId", ["productId"]),
  product_keycap: defineTable({
    productId: v.id("product"),
    price: v.optional(v.float64()),
    quantity: v.int64(),
    option: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          image: v.id("image"),
        })
      )
    ),
  }).index("by_productId", ["productId"]),
  image: defineTable({
    url: v.string(),
    productId: v.string(),
  }).index("by_product", ["productId"]),
  orderItem: defineTable({
    productId: v.id("product"),
  }).index("by_product", ["productId"]),
  order: defineTable({
    items: v.array(v.id("orderItem")),
    phone: v.string(),
    address: v.string(),
    isPaid: v.boolean(),
  }).index("by_user_phone", ["phone"]),
});
