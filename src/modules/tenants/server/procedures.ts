
import { DEFAULT_LIMIT } from "@/constants";
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";



export const tenantsRouter = createTRPCRouter({


    getOne: baseProcedure.input(z.object({
        // Define any input schema if needed
        slug: z.string()
    })).query(async ({ ctx, input }) => {


        const tenantsData = await ctx.payload.find({
            collection: "tenants",
            where: {
                slug: {
                    equals: input.slug
                }
            },
            limit: 1,
            pagination: false
        });

        const tenant = tenantsData.docs[0];

        if (!tenant) {
            throw new TRPCError({ code: "NOT_FOUND", message: "TENANT_NOT_FOUND" })
        }

        return tenant as Tenant & { image: Media | null }

    })
})