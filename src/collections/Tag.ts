
// Media.ts mein
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
    admin: {
        useAsTitle: 'name',
    },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      unique:true
    }
  ],
}
