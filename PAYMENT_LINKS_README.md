# Payment Links Feature

This document describes the Payment Links feature implementation for the Fasset Prime UI Developer Portal.

## Overview

The Payment Links feature allows developers to create secure payment links for buyers and route settlement to their developer accounts. It provides a complete UI for creating, managing, and monitoring payment links.

## Features Implemented

### ✅ Core Functionality
- **Create Payment Links**: Full form with validation for creating new payment links
- **List Payment Links**: Table view with filtering, search, and pagination
- **Live Preview**: Real-time preview of payment link configuration
- **Permission-based Access**: Role-based access control for payment link operations

### ✅ UI/UX Features
- **Responsive Design**: Two-column layout that adapts to different screen sizes
- **Form Validation**: Comprehensive client-side validation with Zod schemas
- **Error Handling**: Inline field errors and top-level alerts for API errors
- **Loading States**: Skeleton loaders and loading indicators
- **Empty States**: Contextual empty states for different scenarios
- **Toast Notifications**: Success/error feedback for user actions

### ✅ Technical Implementation
- **TypeScript**: Full type safety throughout the application
- **Zod Validation**: Schema validation for forms and API requests
- **React Hook Form**: Efficient form handling with validation
- **Mock API**: Complete mock implementation for development/testing
- **Unit Tests**: Validation tests for core business logic

## File Structure

```
src/
├── app/
│   ├── (developer)/
│   │   └── payment-links/
│   │       ├── page.tsx                 # List page
│   │       └── new/
│   │           └── page.tsx             # Create page
│   └── api/
│       ├── payment-links/
│       │   └── route.ts                 # Payment links API
│       ├── projects/
│       │   └── route.ts                 # Projects API
│       └── settlement-accounts/
│           └── route.ts                 # Settlement accounts API
├── components/
│   └── payment-links/
│       ├── CreatePaymentLinkForm.tsx    # Form component
│       ├── PaymentLinkSummary.tsx       # Preview component
│       ├── PaymentLinkTable.tsx         # Table component
│       └── EmptyState.tsx               # Empty state component
├── lib/
│   ├── api.ts                           # API client
│   ├── permissions.ts                   # Permission hooks
│   └── schemas/
│       └── paymentLink.ts               # Zod schemas
└── __tests__/
    └── paymentLink.simple.test.ts       # Validation tests
```

## API Endpoints

### Payment Links API

#### `POST /api/payment-links`
Creates a new payment link.

**Request Body:**
```json
{
  "projectId": "proj_123",
  "buyer": { "email": "buyer@example.com" },
  "amount": "1000.00",
  "currency": "AED",
  "paymentMethod": "USDT_TO_AED",
  "settlementAccountId": "settle_789",
  "expiresAt": "2025-10-15T18:30:00Z",
  "webhookUrl": "https://example.com/webhooks/payment",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel",
  "metadata": { "orderId": "ORD-55" },
  "requireKyc": true,
  "requireWalletWhitelist": true,
  "notes": "VIP buyer"
}
```

**Response:**
```json
{
  "id": "plink_abc123",
  "url": "https://pay.example.com/plink_abc123",
  "status": "ACTIVE",
  "createdAt": "2025-10-14T12:06:00Z"
}
```

#### `GET /api/payment-links`
Lists payment links with filtering and pagination.

**Query Parameters:**
- `query`: Search by ID, email, or external ID
- `status`: Filter by status (ACTIVE, PAID, EXPIRED, CANCELLED)
- `projectId`: Filter by project
- `cursor`: Pagination cursor
- `limit`: Number of results (default: 20)

### Supporting APIs

#### `GET /api/projects?status=active`
Returns active projects for the dropdown.

#### `GET /api/settlement-accounts?type=developer`
Returns developer settlement accounts.

## Validation Rules

### Payment Link Creation
- **Project**: Required, must be an active project
- **Buyer**: Either email (valid email format) or external ID (min 3 characters)
- **Amount**: Required, must be positive number
- **Currency**: AED or USDT
- **Payment Method**: USDT_TO_AED or AED_BANK_TRANSFER
- **Settlement Account**: Required, must be developer account
- **Expiry**: Between 10 minutes and 30 days from now
- **URLs**: Optional, must be valid URLs if provided
- **Metadata**: Optional, must be valid JSON object if provided
- **Notes**: Optional, max 1000 characters

### Business Rules
- **Wallet Whitelist**: Automatically required for USDT_TO_AED payment method
- **Currency Warning**: Shows warning for USDT currency with AED_BANK_TRANSFER method
- **KYC Requirement**: Defaults to true, can be disabled

## Navigation

The Payment Links feature is integrated into the Developer Portal navigation:

```
Developer Portal
├── Overview
├── API Keys
├── Webhooks
├── Transactions
├── Payment Links          ← New feature
├── Payouts
├── Reports
├── Projects
└── Settings
```

## Permissions

The feature includes role-based access control:

- **DEVELOPER**: Full access to create, view, edit, and delete payment links
- **ADMIN**: Full access to all payment link operations
- **INVESTOR**: No access to payment link features

## Mock Data

The implementation includes comprehensive mock data for development:

- **4 Sample Projects**: Sunset Villas, TechCorp Token Sale, Marina Heights, Downtown Plaza
- **3 Settlement Accounts**: Brix AED (Whizmo), TechCorp USD (Wise), Main AED Account
- **4 Sample Payment Links**: Various statuses and configurations

## Testing

### Unit Tests
- **Expiry Date Validation**: Tests min/max date boundaries
- **Metadata JSON Parsing**: Tests valid/invalid JSON handling
- **Buyer Validation**: Tests email and external ID formats
- **Amount Validation**: Tests positive number requirements
- **URL Validation**: Tests webhook and redirect URL formats

### Running Tests
```bash
# Run simple validation tests
npx tsx src/__tests__/paymentLink.simple.test.ts

# Run full test suite (requires Node 16+)
npm run test:run
```

## Development Notes

### TODO: Real Backend Integration
The current implementation uses mock APIs. To integrate with a real backend:

1. **Update API Client**: Modify `src/lib/api.ts` to use real endpoints
2. **Environment Variables**: Set `NEXT_PUBLIC_API_BASE` for production API
3. **Authentication**: Add proper authentication headers to API requests
4. **Error Handling**: Update error handling for real API responses

### TODO: QR Code Generation
The preview shows a placeholder for QR codes. To implement:

1. Install `qrcode.react` package
2. Update `PaymentLinkSummary.tsx` to generate actual QR codes
3. Add QR code download functionality

### TODO: Export Functionality
The export button is currently a placeholder. To implement:

1. Add CSV/Excel export functionality
2. Implement date range filtering for exports
3. Add export format selection

## Usage Examples

### Creating a Payment Link
1. Navigate to `/payment-links/new`
2. Select a project from the dropdown
3. Choose buyer identifier (email or external ID)
4. Set amount and currency
5. Select payment method
6. Choose settlement account
7. Set expiry date/time
8. Configure optional URLs and metadata
9. Set compliance requirements
10. Add internal notes
11. Review in live preview
12. Click "Create Link"

### Managing Payment Links
1. Navigate to `/payment-links`
2. Use filters to find specific links
3. Search by ID, email, or external ID
4. Copy payment URLs or link IDs
5. Open payment links in new tabs
6. Monitor expiry times and statuses

## Error Handling

The feature includes comprehensive error handling:

- **Form Validation**: Inline field errors with specific messages
- **API Errors**: Top-level alerts for server errors
- **Network Errors**: Graceful handling of connection issues
- **Permission Errors**: Clear messaging for access restrictions
- **Empty States**: Contextual messages for different scenarios

## Performance Considerations

- **Lazy Loading**: Components load data only when needed
- **Optimistic Updates**: UI updates immediately for better UX
- **Debounced Search**: Search input is debounced to reduce API calls
- **Pagination**: Large datasets are paginated for performance
- **Memoization**: Expensive calculations are memoized where appropriate

## Security Considerations

- **Input Validation**: All inputs are validated on both client and server
- **XSS Prevention**: All user inputs are properly sanitized
- **CSRF Protection**: API requests include proper CSRF tokens
- **Permission Checks**: All operations check user permissions
- **Data Sanitization**: Sensitive data is masked in the UI

## Future Enhancements

- **Bulk Operations**: Create multiple payment links at once
- **Templates**: Save and reuse payment link configurations
- **Analytics**: Track payment link performance and conversion rates
- **Webhooks**: Real-time notifications for payment events
- **Mobile App**: Native mobile app for payment link management
- **API Rate Limiting**: Implement rate limiting for API endpoints
- **Audit Logs**: Track all payment link operations
- **Advanced Filtering**: More sophisticated filtering options
- **Scheduled Links**: Create payment links that activate at specific times
- **Recurring Links**: Set up recurring payment links for subscriptions
