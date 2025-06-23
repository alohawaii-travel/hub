# AlohaWaii Staff Hub

A Next.js-based staff management dashboard for the AlohaWaii tour platform.

## Features

- 🔐 **Google OAuth Authentication** - Secure staff-only access
- 🏢 **Domain Whitelisting** - Restrict access to authorized email domains
- 📊 **Dashboard Interface** - Modern, responsive staff interface
- 🔗 **API Integration** - Connects to main AlohaWaii API
- 🛡️ **Route Protection** - Authenticated routes with middleware

## Tech Stack

- **Next.js 15** with App Router
- **NextAuth.js** for authentication
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Docker** for containerization

## Getting Started

### Prerequisites

- Node.js 18+
- Google Cloud Console project with OAuth credentials
- Running AlohaWaii API (on port 4000)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secure-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ALLOWED_DOMAINS=yourdomain.com,anotherdomain.com
   API_URL=http://localhost:4000
   ```

3. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or use the project script
../scripts/start-hub.sh
```

## Authentication Flow

1. **Landing Page** (`/`) - Redirects based on auth status
2. **Sign In** (`/auth/signin`) - Google OAuth login
3. **Dashboard** (`/dashboard`) - Protected main interface

### Domain Whitelisting

Only users with email addresses from domains listed in `ALLOWED_DOMAINS` can access the hub. This ensures only authorized staff members can sign in.

## API Integration

The hub communicates with the main API through:

- **Internal routes** - Staff operations (protected)
- **Health checks** - System status monitoring
- **User management** - Profile and permissions

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/    # NextAuth configuration
│   ├── auth/signin/               # Login page
│   ├── dashboard/                 # Main dashboard
│   ├── layout.tsx                 # Root layout with providers
│   └── page.tsx                   # Landing page (redirects)
├── lib/
│   ├── api.ts                     # API client for backend communication
│   └── env.ts                     # Environment configuration
├── middleware.ts                  # Route protection
└── providers.tsx                  # SessionProvider wrapper
```

## Environment Variables

| Variable               | Description                   | Required |
|------------------------|-------------------------------|----------|
| `NEXTAUTH_URL`         | Hub application URL           | ✅        |
| `NEXTAUTH_SECRET`      | Secure random string          | ✅        |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID        | ✅        |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret    | ✅        |
| `ALLOWED_DOMAINS`      | Comma-separated email domains | ✅        |
| `API_URL`              | Main API endpoint             | ✅        |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Docker Development

```bash
# Start all services
../scripts/dev-start.sh

# Start only hub
../scripts/dev-start.sh hub

# Start hub only (assumes other services running)
../scripts/dev-start.sh --hub-only
```

## Security

- **Authentication required** for all dashboard routes
- **Domain whitelisting** restricts access to authorized staff
- **JWT sessions** with secure configuration
- **HTTPS redirect** in production (configure NEXTAUTH_URL)

## Contributing

1. Follow TypeScript strict mode
2. Use Tailwind for styling
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure mobile responsiveness

## Production Deployment

1. Set production environment variables
2. Configure HTTPS for `NEXTAUTH_URL`
3. Use secure `NEXTAUTH_SECRET`
4. Set up proper domain whitelisting
5. Configure Google OAuth for production domain

## Troubleshooting

### Common Issues

1. **Google OAuth not working:**
   - Check redirect URIs in Google Cloud Console
   - Verify client ID and secret in `.env.local`

2. **Domain whitelisting blocking access:**
   - Check `ALLOWED_DOMAINS` includes your email domain
   - Verify no extra spaces in domain list

3. **API connection failed:**
   - Ensure main API is running on specified port
   - Check `API_URL` environment variable

4. **Session not persisting:**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches current domain
