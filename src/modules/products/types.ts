

import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type ProductsDetManyOutput = inferRouterOutputs<AppRouter>["products"]["getMany"]
