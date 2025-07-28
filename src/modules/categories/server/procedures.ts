


import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Categorise } from "@/payload-types";



export const categoriesRouter = createTRPCRouter({

    getMany: baseProcedure.query(async ({ ctx }) => {

        const data = await ctx.payload.find({
            collection: "categorise",
            depth: 1,
            pagination: false,
            where: {
                parent: {
                    exists: false,
                },
            },
            sort: "name"
        });

        const formatedData = data.docs.map((doc) => ({
            ...doc,
            // Fixed property name consistency
            subcategorise: Array.isArray(doc.subCategorise?.docs)
                ? doc.subCategorise.docs.map((subDoc) => ({
                    ...(subDoc as Categorise),
                    // Remove nested subcategories to avoid infinite nesting
                }))
                : [], // Default to empty array instead of undefined
        }));

        return formatedData
    })
})