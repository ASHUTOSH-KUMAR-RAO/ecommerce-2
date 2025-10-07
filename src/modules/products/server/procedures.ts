import { Categorise, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../searchParams";
import { DEFAULT_LIMIT } from "@/constants";

import { headers as getHeaders } from "next/headers";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
      });

      let isPurchase = false;

      if (session.user) {
        const orderData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });
        isPurchase = !!orderData.docs[0];
        //! Pehla ! (NOT operator) - truthy/falsy ko opposite boolean banata hai
        //todo=> Doosra ! - usse wapas opposite kar deta hai, final boolean mil jata hai
      }

      const reviews = await ctx.payload.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: input.id,
          },
        },
      });

      const reviewRating =
        reviews.docs.length > 0
          ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
            reviews.totalDocs
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });
        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round(
            (count / reviews.totalDocs) * 100
          );
        });
      }
      return {
        ...product,
        isPurchase,
        images: product.images as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
        // images: product.images as Media | null,
      };
    }),

  getMany: baseProcedure
    .input(
      z.object({
        // Define any input schema if needed
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "name";
      }
      if (input.sort === "hot_and_new") {
        sort = "-createdAt";
      }
      if (input.sort === "trending") {
        sort = "-createdAt";
      }

      // If minPrice is provided, filter products by minimum price
      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.payload.find({
          collection: "categorise",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formatedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategorise: ((doc as any)?.subcategorise &&
          "docs" in (doc as any).subcategorise
            ? (doc as any).subcategorise.docs
            : []
          ).map((subDoc: any) => ({
            ...(subDoc as Categorise),
            subcategorise: undefined,
          })),
        }));

        const subcategories = [];
        // If category is provided, filter products by that category

        const parentCategory = formatedData[0];
        if (parentCategory) {
          subcategories.push(
            ...parentCategory.subcategorise.map(
              (subcategory: Categorise) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategories],
          };
        }
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.payload.find({
        collection: "products",
        depth: 2, //todo=> Hamne yeha per isiliye depth 1 se 2 kiya kyuki humko isme image ka url ko bhi add krna hai ,Populate: "tenant","category","image",& "tenant.image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      const dataWithSummarizedReviews = await Promise.all(
        // yedi hum kabhi bhi promises ke andar Promise.all use karenge then isese hum map ke andar async ko bhi use kr sekte hai aur ye js ka concepts hai
        data.docs.map(async (doc) => {
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
        ...data,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          images: doc.images as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
