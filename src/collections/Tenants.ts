
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            type: "text",
            label: "Store Name",
            admin: {
                description: "The name of the store that will be displayed to customers (eg: Nike)."
            }
        },
        {
            name: "slug",
            type: "text",
            required: true,
            index: true,
            unique: true,
            admin: {
                description: "The unique identifier for the store, used in the URL (eg: nike.domain.com)."
            }
        },

        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },

        {
            name: "stripeAccountId",
            type: "text",
            required: true,
            admin: {
                readOnly: true,
            }
        },

        {
            name: "stripeDetailsSubmitted",
            type: "checkbox",
            admin: {
                readOnly: true,
                description: "Whether the store has submitted their Stripe account details."
            }
        }

    ],
}
