// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Curly braces add karo - named imports
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Categorise } from './collections/Categorise'
import { Products } from './collections/Products'
import { Tags } from './collections/Tag'
import { Tenants } from './collections/Tenants'
import { Orders } from './collections/Orders'
import { Reviews } from './collections/Reviews'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categorise, Products, Tags, Tenants,Orders,Reviews],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
     multiTenantPlugin({
      collections:{
        products:{}
      },
      tenantsArrayField:{
        includeDefaultField: false
      },
      userHasAccessToAllTenants: (user) => Boolean(user?.roles?.includes("super-admin"))
     })
    // storage-adapter-placeholder
  ],
})
