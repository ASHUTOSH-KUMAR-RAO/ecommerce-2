import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        // Define any input schema if needed
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.payload.find({
        collection: "orders",
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const order = ordersData.docs[0];
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order Not Found" });
      }
      const product = await ctx.payload.findByID({
        collection: "products",

        id: input.productId,
      });
      return product;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        // Define any input schema if needed
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.payload.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = ordersData.docs.map((order) => order.product);
      const productsData = await ctx.payload.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });
       const dataWithSummarizedReviews = await Promise.all(
         // yedi hum kabhi bhi promises ke andar Promise.all use karenge then isese hum map ke andar async ko bhi use kr sekte hai aur ye js ka concepts hai
         productsData.docs.map(async (doc) => {
           const reviewsData = await ctx.payload.find({
             collection: "reviews",
             pagination: false,
             where: {
               product: {
                 equals: doc.id,
               },
             },
           });

           return {
             ...doc,
             reviewCount: reviewsData.totalDocs,
             reviewsRating:
               reviewsData.docs.length === 0
                 ? 0
                 : reviewsData.docs.reduce(
                     (acc, review) => acc + review.rating,
                     0
                   ) / reviewsData.totalDocs,
           };
         })
       );
      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          images: doc.images as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
