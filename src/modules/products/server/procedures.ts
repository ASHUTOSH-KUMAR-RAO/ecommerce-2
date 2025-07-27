
import { Categorise } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload";
import z from "zod";



export const productsRouter = createTRPCRouter({


    getMany: baseProcedure.input(z.object({
        // Define any input schema if needed
        category: z.string().nullable().optional()
    })).query(async ({ ctx, input }) => {
        const where: Where = {};
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
            }
            where["category.slug"] = {
                in: [parentCategory.slug, ...subcategories]
            };
        }

        const data = await ctx.payload.find({
            collection: "products",
            depth: 1,
            where
        });

        return data

    })
})