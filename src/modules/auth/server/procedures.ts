import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";
import { loginSchemas, registerSchemas } from "../schemas";
import { generateAuthCookies } from "../utils";
import { stripe } from "@/lib/stripe";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.payload.auth({ headers });
    return session;
  }),

  register: baseProcedure
    .input(registerSchemas)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This Username will be already exist",
        });
      }

      const account = await stripe.accounts.create({});
      if (!account) {
        throw new TRPCError({code:"BAD_REQUEST",message:"Failed To Create stripe account."})
      }
      const tenants = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      });

      try {
        // User create karo
        const user = await ctx.payload.create({
          collection: "users",
          data: {
            email: input.email,
            password: input.password,
            username: input.username,
            tenants: [
              {
                tenant: tenants.id,
              },
            ],
          },
        });

        // Automatic login after registration
        const loginData = await ctx.payload.login({
          collection: "users",
          data: {
            email: input.email,
            password: input.password,
          },
        });

        if (!loginData.token) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate authentication token",
          });
        }

        // Cookie set karo - YE THA MISSING! 🎯
        await generateAuthCookies({
          prefix: ctx.payload.config.cookiePrefix,
          value: loginData.token,
        });

        return {
          success: true,
          message: "Account created successfully! ✅",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
          token: loginData.token, // Token bhi return kar rahe hain
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Failed to create account. Email or username might already exist.",
        });
      }
    }),

  login: baseProcedure.input(loginSchemas).mutation(async ({ input, ctx }) => {
    try {
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login...❌",
        });
      }

      await generateAuthCookies({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token,
      });

      return {
        success: true,
        message: "Login successful! ✅",
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }
  }),
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

FIX SUMMARY:
✅ Register ke baad automatic login
✅ Cookie generation after registration
✅ Token return kar rahe hain response mein
✅ Proper error handling for token generation
*/
