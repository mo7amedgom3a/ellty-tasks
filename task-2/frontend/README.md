# Math Calculation App - Frontend

A modern, interactive web application for creating and visualizing mathematical calculation trees. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## ✨ Features

### Core Functionality

- 🔐 **User Authentication**

  - Register new accounts with auto-generated avatars
  - Secure login with JWT tokens
  - Persistent authentication state

- 🧮 **Calculation Trees**

  - Start new calculations with an initial value
  - Add operations (ADD, SUB, MUL, DIV) to any node
  - Visual tree representation of calculations
  - Real-time calculation updates

- 👥 **Multi-User Collaboration**

  - View all public calculation trees
  - See who created each calculation node
  - Add operations to other users' calculations
  - User avatars and usernames displayed

- 🎨 **Modern UI/UX**
  - Clean, gradient-based design
  - Responsive layout for all devices
  - Smooth animations and transitions
  - Interactive hover effects
  - Toast notifications for user feedback

### User Roles

- **Unregistered Users**: Can view all calculation trees
- **Registered Users**: Can create calculations and add operations
- **Admin Users**: Additional management capabilities

## 🏗️ Architecture

### Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API
- **Icons**: Lucide React

### Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page (calculation trees)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── auth/         # Authentication components
│   │   ├── calculations/ # Calculation-related components
│   │   └── layout/       # Layout components
│   ├── lib/              # Utility functions
│   │   ├── api.ts        # API client
│   │   └── utils.ts      # Helper functions
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── contexts/         # React contexts
├── public/               # Static assets
│   └── avatars/         # User avatar images
├── .env.local           # Environment variables
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    App Layout                            │
│  - Global navigation                                     │
│  - Authentication state                                  │
│  - Theme provider                                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Page Components                         │
│  - Main calculation view                                 │
│  - User profile                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Feature Components                          │
│  - CalculationTree                                       │
│  - CalculationNode                                       │
│  - AuthForm (Login/Register)                             │
│  - AddOperationDialog                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                UI Components                             │
│  - Button, Input, Dialog, Card, etc.                     │
│  - Reusable, accessible components from shadcn/ui        │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Local Installation

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env.local` file in the frontend directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   **Important:** The `NEXT_PUBLIC_` prefix makes the variable accessible in the browser.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will start on `http://localhost:3000`

5. **Open in browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Installation

See the [Docker Setup](#-docker-setup) section below for running with Docker Compose.

---

## 🐳 Docker Setup

### Running with Docker Compose

The easiest way to run the entire application (frontend, backend, and database) is using Docker Compose from the project root.

1. **Navigate to the project root:**

   ```bash
   cd task-2
   ```

2. **Start all services:**

   ```bash
   docker-compose up
   ```

   Or run in detached mode:

   ```bash
   docker-compose up -d
   ```

3. **Create database migrations** (first time setup):

   ```bash
   docker-compose exec backend npx prisma migrate dev --name init
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5433

### Docker Services

The frontend service in `docker-compose.yml`:

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  container_name: ellty-frontend
  ports:
    - "3000:3000"
  environment:
    - NEXT_PUBLIC_API_URL=http://localhost:5000
  volumes:
    - ./frontend:/app
    - /app/node_modules
    - /app/.next
  depends_on:
    - backend
```

**Features:**

- Hot reload enabled via volume mounts
- Automatic restart on crashes
- Waits for backend to be ready

### Useful Docker Commands

```bash
# View frontend logs
docker-compose logs -f frontend

# Rebuild frontend
docker-compose up --build frontend

# Execute commands in frontend container
docker-compose exec frontend npm run build
docker-compose exec frontend npm run lint

# Restart frontend only
docker-compose restart frontend
```

---

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

| Variable              | Description          | Default                 | Required |
| --------------------- | -------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` | Yes      |

**Note:** All environment variables that need to be accessible in the browser must be prefixed with `NEXT_PUBLIC_`.

### Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling
- **Prettier** for code formatting

Configuration files:

- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `tailwind.config.ts` - Tailwind CSS configuration

---

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS with a custom configuration:

- **Color Palette**: Custom gradient colors
- **Typography**: Inter font family
- **Animations**: Custom keyframes for smooth transitions
- **Dark Mode**: Support for dark mode (via `next-themes`)

### Custom Styles

Global styles are defined in `app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... more CSS variables */
  }
}
```

### Component Library

The app uses [shadcn/ui](https://ui.shadcn.com/) components, which are:

- Built on Radix UI primitives
- Fully accessible (ARIA compliant)
- Customizable with Tailwind CSS
- Copy-paste friendly (not an npm package)

---

## 📱 Features in Detail

### Authentication Flow

1. **Registration**

   - User enters username and password
   - Backend generates a random avatar
   - JWT token is returned and stored
   - User is automatically logged in

2. **Login**

   - User enters credentials
   - Backend validates and returns JWT token
   - Token is stored in localStorage
   - User state is updated globally

3. **Logout**
   - Token is removed from localStorage
   - User state is cleared
   - Redirected to login page

### Calculation Tree Visualization

- **Tree Structure**: Hierarchical display of calculation nodes
- **Node Information**:

  - Operation type (START, ADD, SUB, MUL, DIV)
  - Input value
  - Calculated result
  - Creator's username and avatar
  - Timestamp

- **Interactive Features**:
  - Click any node to add a child operation
  - Hover to see details
  - Visual indicators for different operations

### Adding Operations

1. Click on any calculation node
2. Select operation type (ADD, SUB, MUL, DIV)
3. Enter input value
4. Submit to create new child node
5. Tree updates in real-time

---

## 🔐 Authentication

### JWT Token Management

The app uses JWT tokens for authentication:

1. Token is received from backend on login/register
2. Stored in `localStorage` under key `token`
3. Included in all API requests via `Authorization` header
4. Automatically refreshed on page load

### Protected Routes

Some features require authentication:

- Creating new calculations
- Adding operations to calculations
- Viewing user profile
- Admin features

Unauthenticated users can:

- View all public calculation trees
- Register for an account
- Login to existing account

---

## 🧪 Testing

### Manual Testing

1. **Test Registration**

   - Open http://localhost:3000
   - Click "Register"
   - Enter username and password
   - Verify avatar is generated
   - Verify automatic login

2. **Test Calculations**

   - Click "Start New Calculation"
   - Enter initial value
   - Click on the created node
   - Add an operation (e.g., ADD 5)
   - Verify result is calculated correctly

3. **Test Multi-User**
   - Register a second user
   - Add operation to first user's calculation
   - Verify both users' avatars appear

### Browser Testing

Recommended browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## 📦 Dependencies

### Production Dependencies

| Package                    | Purpose                      |
| -------------------------- | ---------------------------- |
| `next`                     | React framework with SSR/SSG |
| `react`                    | UI library                   |
| `react-dom`                | React DOM renderer           |
| `@tanstack/react-query`    | Server state management      |
| `react-hook-form`          | Form handling                |
| `zod`                      | Schema validation            |
| `@radix-ui/*`              | Accessible UI primitives     |
| `lucide-react`             | Icon library                 |
| `tailwind-merge`           | Tailwind class merging       |
| `class-variance-authority` | Component variants           |
| `next-themes`              | Theme management             |
| `sonner`                   | Toast notifications          |

### Development Dependencies

| Package        | Purpose                     |
| -------------- | --------------------------- |
| `typescript`   | Type checking               |
| `@types/*`     | TypeScript type definitions |
| `eslint`       | Code linting                |
| `tailwindcss`  | CSS framework               |
| `autoprefixer` | CSS vendor prefixes         |
| `postcss`      | CSS processing              |

---

## 🔧 Troubleshooting

### API Connection Issues

**Problem**: Frontend can't connect to backend

**Solutions**:

1. Verify backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is enabled in backend
4. Check browser console for errors

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Docker Issues

**Problem**: Frontend container won't start

**Solutions**:

```bash
# Check logs
docker-compose logs frontend

# Rebuild container
docker-compose up --build frontend

# Clean restart
docker-compose down
docker-compose up --build
```

### Hot Reload Not Working

**Problem**: Changes don't reflect in browser

**Solutions**:

1. Hard refresh browser (Ctrl+Shift+R)
2. Check terminal for compilation errors
3. Restart dev server
4. For Docker: Check volume mounts are correct

---

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Update `.env.local` with production values:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Platforms

This Next.js app can be deployed to:

- **Vercel** (recommended)
  - Zero configuration
  - Automatic HTTPS
  - Global CDN
- **Docker**
  - Use provided Dockerfile
  - Deploy to any container platform
- **Traditional Hosting**
  - Build and serve the `.next` folder
  - Requires Node.js runtime

---

## 📝 License

ISC

---

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and architecture patterns.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📚 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### React Resources

- [React Documentation](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### shadcn/ui

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
