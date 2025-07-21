import z from "zod"
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import { AUTH_COOKIE } from "../constants";
import { loginSchemas, registerSchemas } from "../schemas";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()
        const session = await ctx.payload.auth({ headers });
        return session
    }),

    register: baseProcedure
        .input(registerSchemas)
        .mutation(async ({ input, ctx }) => {
            const existingData = await ctx.payload.find({
                collection: "users",
                limit: 1,
                where: {
                    username: {
                        equals: input.username
                    }
                }
            })

            const existingUser = existingData.docs[0];
            if (existingUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "This Username will be already exist",
                })
            }
            try {
                const user = await ctx.payload.create({
                    collection: 'users',
                    data: {
                        email: input.email,
                        password: input.password,
                        username: input.username
                    }
                });

                return {
                    success: true,
                    message: "Account created successfully! ✅",
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username
                    }
                };
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create account. Email or username might already exist."
                });
            }
        }),

    login: baseProcedure
        .input(
         loginSchemas
        )
        .mutation(async ({ input, ctx }) => {
            try {
                const data = await ctx.payload.login({
                    collection: 'users',
                    data: {
                        email: input.email,
                        password: input.password
                    }
                });

                if (!data.token) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Failed to login...❌"
                    })
                }

                const cookies = await getCookies();
                cookies.set({
                    name: AUTH_COOKIE,
                    value: data.token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                    // Cross Domain Cookies Sharing (if needed)
                    // sameSite: "none",
                    // domain: ".yourdomain.com"
                });

                return {
                    success: true,
                    message: "Login successful! ✅",
                    user: data.user,
                    token: data.token
                };
            } catch (error) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password"
                });
            }
        }),

    logout: baseProcedure
        .mutation(async ({ ctx }) => {
            try {
                const cookies = await getCookies();
                cookies.delete(AUTH_COOKIE);

                // Optional: PayloadCMS logout
                // await ctx.payload.logout();

                return {
                    success: true,
                    message: "Logged out successfully! 👋"
                };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to logout"
                });
            }
        })
});

/* 
Cross-domain cookie sharing KO avoid karne ke liye hum ye methods use karte hai:

1. Same domain strategy - Sab kuch same domain pe rakhna
2. JWT in headers - Cookies ki jagah headers mein token pass karna

Cross-domain cookies ki problems:
- Security risks zyada hai
- Browser restrictions hai
- CORS configuration complex ho jaati hai
- Cookie SameSite policies create issues

PayloadCMS Benefits:
- Automatic password hashing (bcrypt)
- Built-in validation
- Session management
- No manual salt/hash implementation needed
*/