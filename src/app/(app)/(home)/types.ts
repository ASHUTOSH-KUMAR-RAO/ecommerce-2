import { Categorise } from "@/payload-types";

export type CustomCategory = Categorise & {
    subcategorise: Categorise[] // singular to match your usage
}