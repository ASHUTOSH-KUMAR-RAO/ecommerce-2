import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Categorise: CollectionConfig = {
  slug: "categorise",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categorise",
      hasMany: false,
    },
    {
      name: "subCategorise",
      type: "join",
      collection: "categorise",
      on: "parent",
      hasMany: true,
    },
  ],
};
