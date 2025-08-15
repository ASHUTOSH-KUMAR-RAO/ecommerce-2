
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";


export const checkoutRouter = createTRPCRouter({


    getProducts: baseProcedure.input(z.object({

        ids: z.array(z.string())// Define any input schema if needed

    })).query(async ({ ctx, input }) => {

        const data = await ctx.payload.find({
            collection: "products",
            depth: 2,//todo=> Hamne yeha per isiliye depth 1 se 2 kiya kyuki humko isme image ka url ko bhi add krna hai ,Populate: "tenant","category","image",& "tenant.image",
            where: {
                id: {
                    in: input.ids
                }
            }
        });

        if (data.totalDocs !== input.ids.length) {
            throw new TRPCError({ code: "NOT_FOUND", message: "products_not_found" })
        }

        return {

            ...data,
            totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
            docs: data.docs.map((doc) => ({
                ...doc,
                images: doc.images as Media | null,
                tenant: doc.tenant as Tenant & { image: Media | null }
            }))
        }

    })
})