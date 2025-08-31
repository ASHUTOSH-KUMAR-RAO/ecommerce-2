# E-Commerce Application

A modern, full-stack e-commerce application built with Next.js 15, PayloadCMS, and Stripe integration.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 with React 19
- **Backend/CMS:** PayloadCMS with MongoDB
- **Payment:** Stripe Integration
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Zustand + TanStack Query
- **API:** tRPC for type-safe APIs
- **Animations:** Framer Motion
- **Forms:** React Hook Form with Zod validation
- **Runtime:** Bun (recommended) or Node.js

## 📦 Features

- Modern e-commerce interface with product catalog
- Content Management System powered by PayloadCMS
- Secure payment processing with Stripe
- Responsive design with dark/light theme support
- Type-safe API calls with tRPC
- Multi-tenant architecture support
- Rich text editing capabilities
- Advanced UI components with Radix UI

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or Bun
- MongoDB database
- Stripe account for payments

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ASHUTOSH-KUMAR-RAO/ecommerce-2.git
   cd ecommerce-2
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URI=mongodb://localhost:27017/ecommerce
   
   # PayloadCMS
   PAYLOAD_SECRET=your-payload-secret-key
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Next.js
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Fresh database migration
   bun run db:fresh
   
   # Seed with sample data
   bun run db:seed
   
   # Or reset everything
   bun run db:reset
   ```

5. **Generate Types**
   ```bash
   bun run generate:types
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Start development server with Turbopack
bun run dev

# Server will start at http://localhost:3000
```

### Production Mode
```bash
# Build the application
bun run build

# Start production server
bun run start
```

## 💳 Stripe Setup

### Local Development
1. **Login to Stripe CLI**
   ```bash
   bun run stripe:login
   ```

2. **Listen for webhooks**
   ```bash
   bun run stripe:listen
   ```

3. **Test Stripe integration**
   ```bash
   bun run stripe:test
   bun run stripe:events
   ```

### Webhook Testing
```bash
# Trigger test payment events
bun run stripe:trigger
```

## 📁 Project Structure

```
ecommerce-2/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # Reusable React components
│   ├── lib/          # Utility functions and configs
│   ├── server/       # tRPC server and API routes
│   └── seed.ts       # Database seeding script
├── payload.config.ts # PayloadCMS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── next.config.js    # Next.js configuration
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server with Turbopack |
| `build` | Build production application |
| `start` | Start production server |
| `lint` | Run ESLint for code quality |
| `generate:types` | Generate TypeScript types from PayloadCMS |
| `db:fresh` | Fresh database migration |
| `db:seed` | Seed database with sample data |
| `db:reset` | Reset and reseed database |
| `stripe:login` | Login to Stripe CLI |
| `stripe:listen` | Listen for Stripe webhooks |
| `stripe:test` | Test Stripe CLI installation |

## 🎨 UI Components

This project uses a comprehensive UI library built on:
- **Radix UI** - Accessible, unstyled components
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, customizable components
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icon library

## 🔧 Configuration

### PayloadCMS Admin
- Access admin panel at `/admin`
- Configure collections, fields, and relationships
- Manage content and media uploads

### Environment Variables
Make sure to set up all required environment variables for:
- Database connection
- PayloadCMS configuration
- Stripe API keys
- Authentication secrets

## 🚀 Deployment

### Recommended Platforms
- **Vercel** (Next.js optimized)
- **Railway** 
- **DigitalOcean**
- **AWS/GCP**

### MongoDB Setup
- Use MongoDB Atlas for cloud database
- Or self-hosted MongoDB instance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👤 Author

**Ashutosh Kumar Rao**
- GitHub: [@ASHUTOSH-KUMAR-RAO](https://github.com/ASHUTOSH-KUMAR-RAO)

---

*Built with ❤️ using Next.js and PayloadCMS*
