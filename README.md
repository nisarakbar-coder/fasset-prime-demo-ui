# Fasset Prime Portals

A comprehensive multi-portal web application built with Next.js, TypeScript, and modern web technologies for digital asset management and investment platforms.

## 🚀 Features

### Three Distinct Portals

1. **Investor Portal** (`/investor/*`) - B2C investment platform
   - User registration and KYC verification
   - Wallet whitelisting and management
   - Fund deposits and portfolio tracking
   - Multi-step onboarding process

2. **Developer Portal** (`/dev/*`) - B2B API integration platform
   - API key management
   - Webhook configuration and monitoring
   - Transaction and payout tracking
   - Code examples and documentation

3. **Admin Portal** (`/admin/*`) - Internal operations platform
   - KYC queue management
   - Transaction monitoring
   - AML compliance tools
   - System reports and analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theming**: next-themes (light/dark mode)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fasset-prime-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

The application includes mock authentication with the following demo accounts:

### Investor Portal
- **Email**: `investor@example.com`
- **Password**: `password123`

### Developer Portal
- **Email**: `developer@example.com`
- **Password**: `password123`

### Admin Portal
- **Email**: `admin@example.com`
- **Password**: `password123`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (investor)/        # Investor portal routes
│   ├── (developer)/       # Developer portal routes
│   ├── (admin)/          # Admin portal routes
│   └── api/              # API route handlers
├── components/
│   ├── ui/               # shadcn/ui components
│   └── shared/           # Custom shared components
├── lib/                  # Utilities and configurations
├── schemas/              # Zod validation schemas
└── hooks/                # Custom React hooks
```

## 🎨 Key Components

### Shared Components
- `AppShell` - Responsive layout with sidebar and navigation
- `StatCard` - KPI display cards
- `KPIGrid` - Grid layout for statistics
- `StatusPill` - Status indicators with color coding
- `Copyable` - Copy-to-clipboard functionality
- `FunnelChart` - Conversion funnel visualization
- `TimeSeriesChart` - Time-based data visualization

### Portal-Specific Features

#### Investor Portal
- Multi-step KYC form with document upload
- Wallet address validation and whitelisting
- Deposit address generation with QR codes
- Investment funnel tracking
- Support ticket system

#### Developer Portal
- API key management with permissions
- Webhook configuration and testing
- Code examples in multiple languages
- Transaction monitoring dashboard
- Real-time system health metrics

#### Admin Portal
- KYC review queue with document preview
- Bulk operations and assignment tools
- Risk assessment and AML monitoring
- Comprehensive reporting dashboard
- User and role management

## 🔌 API Endpoints

The application includes mock API endpoints for development:

- `POST /api/kyc/start` - Start KYC process
- `POST /api/wallets/whitelist` - Submit wallet for whitelisting
- `GET /api/deposits/address` - Generate deposit address
- `GET /api/transactions` - Fetch transactions with filtering
- `GET /api/payouts` - Fetch payout records
- `POST /api/webhooks/test` - Test webhook delivery
- `GET /api/admin/kyc` - Admin KYC queue management

## 🎯 Key Features

### Authentication & Authorization
- Role-based access control (Investor, Developer, Admin)
- Protected routes with middleware
- Persistent session management
- Mock authentication for development

### Data Management
- Comprehensive Zod schemas for type safety
- Mock data with realistic scenarios
- Pagination and filtering support
- Real-time updates simulation

### User Experience
- Responsive design for all screen sizes
- Dark/light theme support
- Loading states and error handling
- Toast notifications for user feedback
- Accessible components with ARIA labels

### Developer Experience
- TypeScript for type safety
- ESLint and Prettier for code quality
- Absolute imports with `@/` alias
- Hot reloading for fast development
- Comprehensive component library

## 🧪 Testing

The project is set up for testing with:

- **Playwright** - End-to-end testing
- **Vitest** - Unit testing
- **Testing Library** - Component testing

Run tests:
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:ui     # Test UI
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
docker build -t fasset-prime-ui .
docker run -p 3000:3000 fasset-prime-ui
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_APP_URL` - Application URL
- `DATABASE_URL` - Database connection (production)
- `NEXTAUTH_SECRET` - Authentication secret
- `API_BASE_URL` - Backend API URL
- Blockchain RPC URLs for different networks

### Customization
- Modify `tailwind.config.js` for styling
- Update `components.json` for shadcn/ui configuration
- Customize schemas in `src/schemas/`
- Add new API routes in `src/app/api/`

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Collapsible sidebar navigation
- Touch-friendly interface elements
- Optimized layouts for tablets and phones

## 🌙 Theme Support

- System preference detection
- Manual theme switching
- Persistent theme selection
- Accessible color contrast ratios

## 🔒 Security Features

- Input validation with Zod schemas
- XSS protection with React
- CSRF protection with Next.js
- Secure API key handling
- Role-based access control

## 📊 Analytics & Monitoring

Ready for integration with:
- Google Analytics
- Sentry error tracking
- Performance monitoring
- User behavior analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- Real blockchain integration
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Advanced security features
- Performance optimizations

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.