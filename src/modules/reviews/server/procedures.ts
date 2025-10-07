import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        // Define any input schema if needed
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        depth:0,
        collection: "products",
        id: input.productId,
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      const reviewsData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: product.id,
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

      const review = reviewsData.docs[0];
      if (!review) {
        return null;
      }
      return review;
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: "Rating Is Required" }).max(5),
        description: z
          .string()
          .min(1, { message: "Description Is Required" })
          .max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      const existingReviews = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: { equals: input.productId },
            },
            {
              user: { equals: ctx.session.user.id },
            },
          ],
        },
      });

      if (existingReviews.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already review this product",
        });
      }
      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });
      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: "Rating Is Required" }).max(5),
        description: z
          .string()
          .min(1, { message: "Description Is Required" })
          .max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.payload.findByID({
        collection: "reviews",
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review Not Found" });
      }
      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update review",
        });
      }

      const UpdatedReview = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });
      return UpdatedReview;
    }),
});
