import { Media, Tenant } from "@/payload-types";
import { baseProcedure, protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import type Stripe from "stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({

    purchase: protectedProcedure
        .input(z.object({ 
            productIds: z.array(z.string()).min(1),  // ✅ Fixed: "productsIds" → "productIds"
            tenantSlug: z.string().min(1) 
        }))
        .mutation(async ({ ctx, input }) => {
            console.log("🔍 Purchase procedure started with:", input);
            
            const products = await ctx.payload.find({
                collection: "products",
                depth: 2,
                where: {
                    and: [
                        {
                            id: {
                                in: input.productIds  // ✅ Fixed: "productsIds" → "productIds"
                            }
                        },
                        {
                            "tenant.slug": {  // ✅ Fixed: "tenan.slug" → "tenant.slug"
                                equals: input.tenantSlug
                            }
                        }
                    ]
                }
            });

            console.log(`📦 Found ${products.totalDocs} products out of ${input.productIds.length} requested`);

            if (products.totalDocs !== input.productIds.length) {
                console.log("❌ Product count mismatch");
                throw new TRPCError({ code: "NOT_FOUND", message: "PRODUCTS_NOT_FOUND" });
            }

            const tenantsData = await ctx.payload.find({
                collection: "tenants",
                limit: 1,
                pagination: false,
                where: {
                    slug: {
                        equals: input.tenantSlug
                    }
                }
            });

            const tenant = tenantsData.docs[0];

            if (!tenant) {
                console.log("❌ Tenant not found");
                throw new TRPCError({ code: "NOT_FOUND", message: "TENANT_NOT_FOUND" });
            }

            console.log(`🏪 Tenant found: ${tenant.name}`);

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map((product) => ({
                quantity: 1,
                price_data: {
                    unit_amount: product.price * 100,  // Stripe price ko cents ke form mein handle karta hai 
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        metadata: {
                            stripeAccountId: tenant.stripeAccountId,
                            id: product.id,
                            name: product.name,
                            price: product.price
                        } as ProductMetadata
                    }
                }
            }));

            console.log("💳 Creating Stripe checkout session...");

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user.email,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
                mode: "payment",
                line_items: lineItems,
                invoice_creation: { //! jaise hum payment krte hai n uske baad invoice create just wahi same things hum kaar rehe hai ,menas real world experience 
                    enabled: true
                },
                metadata: {
                    userId: ctx.session.user.id
                } as CheckoutMetadata
            });

            if (!checkout.url) {
                console.log("❌ Failed to create checkout session");
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "failed to create checkout session" });
            }

            console.log("✅ Checkout session created successfully:", checkout.url);
            return { url: checkout.url };
        }),

    getProducts: baseProcedure
        .input(z.object({
            ids: z.array(z.string())// Define any input schema if needed
        }))
        .query(async ({ ctx, input }) => {

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
                throw new TRPCError({ code: "NOT_FOUND", message: "products_not_found" });
            }

            return {
                ...data,
                totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
                docs: data.docs.map((doc) => ({
                    ...doc,
                    images: doc.images as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null }
                }))
            };
        })
});