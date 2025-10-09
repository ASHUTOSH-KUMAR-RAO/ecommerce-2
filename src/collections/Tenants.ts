import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "slug",
  },
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store Name",
      admin: {
        description:
          "The name of the store that will be displayed to customers (eg: Nike).",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      index: true,
      unique: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description:
          "The unique identifier for the store, used in the URL (eg: nike.domain.com).",
      },
    },

    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },

    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        readOnly: true,
        description: "Stripe Account Id associated with your shop",
      },
    },

    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      admin: {
        readOnly: true,
        description:
          "Whether the store has submitted their Stripe account details.",
      },
    },
  ],
};
