
import { Categorise } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../searchParams";


export const productsRouter = createTRPCRouter({

    getMany: baseProcedure.input(z.object({
        // Define any input schema if needed
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
    })).query(async ({ ctx, input }) => {
        const where: Where = {};

        let sort : Sort = "-createdAt"

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
                less_than_equal: input.maxPrice
            };
        } else if (input.minPrice) {
            where.price = {
                greater_than_equal: input.minPrice
            }
        } else if (input.maxPrice) {
            where.price = {
                ...where.price,
                less_than_equal: input.maxPrice
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
                        equals: input.category
                    }
                }
            })

            const formatedData = categoriesData.docs.map((doc) => ({
                ...doc,
                subcategorise: ((doc as any)?.subcategorise && "docs" in (doc as any).subcategorise ? (doc as any).subcategorise.docs : []).map((subDoc: any) => ({
                    ...(subDoc as Categorise),
                    subcategorise: undefined,
                }))
            }));


            const subcategories = []
            // If category is provided, filter products by that category

            const parentCategory = formatedData[0];
            if (parentCategory) {
                subcategories.push(
                    ...parentCategory.subcategorise.map((subcategory: Categorise) => subcategory.slug)
                )
                where["category.slug"] = {
                    in: [parentCategory.slug, ...subcategories]
                };
            }
        }

        if (input.tags && input.tags.length > 0) {
            where["tags.name"] = {
                in: input.tags
            };
        }

        const data = await ctx.payload.find({
            collection: "products",
            depth: 1,
            where,
            sort
        });

        return data

    })
})