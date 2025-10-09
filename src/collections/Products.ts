import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
      return Boolean(tenant?.stripeDetailsSubmitted);
    },
  },
  admin: {
    useAsTitle: "name",
  },
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
      admin: {
        step: 0.01, // Allows for decimal prices
        description:
          "Enter the price in your preferred currency e.g., 19.99 USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categorise",
      hasMany: false,
      required: true,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
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
        },
      ],
      defaultValue: "30_days",
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "content",
      type: "textarea",
      admin: {
        description:
          "Protected content only visible to customer after purchase.Add Product documentation,downloadable files,getting started guides,and bonus material.",
      },
    },
  ],
};
