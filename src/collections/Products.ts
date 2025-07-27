

import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
    slug: "products",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "text",
            required: true,
        },
        {
            name: "price",
            type: "number",
            required: true,
            admin:{
                step: 0.01, // Allows for decimal prices
                description: "Enter the price in your preferred currency e.g., 19.99 USD",
            }
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categorise",
            hasMany: false,
            required: true,
        },
        {
            name: "images",
            type: "upload",
            relationTo: "media",
            hasMany: true,
            maxRows: 5,
        },
        {
            name: "reFundPolicy",
            type: "select",
            options: [
                {
                    label: "30 Days",
                    value: "30_days",
                },
                {
                    label: "60 Days",
                    value: "60_days",
                },
                {
                    label: "90 Days",
                    value: "90_days",
                },
                {
                    label: "No Refund",
                    value: "no_refund",
                }
            ],
            defaultValue: "30_days",
        },
        {
            name: "isFeatured",
            type: "checkbox",
            defaultValue: false,
        },
    ],
};