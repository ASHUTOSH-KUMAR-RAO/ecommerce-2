
import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";



export const tagsRouter = createTRPCRouter({


    getMany: baseProcedure.input(z.object({
        // Define any input schema if needed
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
    })).query(async ({ ctx, input }) => {


        const data = await ctx.payload.find({
            collection: "tags",
            limit: input.limit,
            page: input.cursor,
        });

        return data

    })
})