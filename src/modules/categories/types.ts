

import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type CategoriesDetManyOutput = inferRouterOutputs<AppRouter>["categories"]["getMany"]

export type CategoriesDetManyOutputSingle = CategoriesDetManyOutput[0]