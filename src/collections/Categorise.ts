
import type { CollectionConfig } from 'payload'

export  const Categorise: CollectionConfig = {

    slug: "categorise",
    fields: [
        {
            name: "name",
            type: "text",
            required: true
        }
    ],
}
