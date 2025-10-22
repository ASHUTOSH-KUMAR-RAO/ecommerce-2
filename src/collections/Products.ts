import { isSuperAdmin } from "@/lib/access";
import { lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";
// import { Tenant } from "@/payload-types";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: () => true,
    create: () => true,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your account before creating a products ",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
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
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: "name",
                    type: "text",
                  },
                ],
              },
            },
          }),
        ],
      }),
      admin: {
        description:
          "Protected content only visible to customer after purchase.Add Product documentation,downloadable files,getting started guides,and bonus material.",
      },
    },

    {
      name: "isPrivate",
      label: "Private",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "Check this Product will be not shown on the storeFront",
      },
    },
    {
      name: "isArchived",
      label: "Archive",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "Check If you want to hide or delete the product",
      },
    },
  ],
};
