# Medynx - Doctor Appointment System

A modern, full-stack web application for booking and managing video consultations with doctors, featuring integrated Zoom meetings and advanced animations.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/register system with JWT tokens and animated UI
- **Role-Based Access**: Three user roles (Patient, Doctor, Admin) with specific permissions
- **Video Consultations**: Real-time video appointment scheduling with integrated Zoom meetings
- **Payment Processing**: Paystack integration for secure payment handling
- **Medical Records**: Digital storage and management of patient medical files
- **Dashboard Analytics**: Comprehensive dashboards for all user types
- **Animated Interface**: Smooth Framer Motion animations throughout the application

### User Roles & Capabilities

#### Patients
- Browse and search verified doctors with animated cards
- Book video consultations with real-time availability and interactive timeline
- Join video meetings through integrated Zoom
- View appointment history and medical records
- Make secure payments via Paystack integration

#### Doctors
- Manage appointment schedules and availability
- Conduct video consultations with patients via Zoom
- Access patient medical records securely
- Update consultation notes and prescriptions
- View earnings and appointment statistics

#### Administrators
- Approve/reject doctor registrations
- Monitor system-wide statistics with animated dashboards
- Manage users and appointments
- Handle payment disputes and refunds
- System configuration and user management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development with strict typing
- **Tailwind CSS** - Utility-first CSS framework with custom configurations
- **Framer Motion** - Advanced animation library for smooth interactions
- **Radix UI** - Accessible component library with custom styling
- **Lucide React** - Modern icon library with consistent design
- **React Hook Form** - Form handling with validation and error management
- **Zod** - Runtime type validation and schema parsing

### Backend
- **Next.js API Routes** - Server-side API endpoints with middleware
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication with refresh tokens
- **bcryptjs** - Password hashing with salt rounds

### Third-Party Integrations
- **Zoom API** - Video consultation meetings with SDK integration
- **Paystack** - Payment processing with webhook support
- **UploadThing** - File upload handling for medical documents
- **Nodemailer** - Email notifications and appointment reminders

### Development Tools
- **ESLint** - Code linting with Next.js configuration
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first styling
- **Turbopack** - Fast development server

## 📁 Project Structure

```
doctor_appointment_app-3.0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin-specific endpoints
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── login/     # Login API
│   │   │   │   ├── register/  # Registration API
│   │   │   │   └── logout/    # Logout API
│   │   │   ├── appointments/  # Appointment management
│   │   │   ├── doctors/       # Doctor-related endpoints
│   │   │   ├── patients/      # Patient-related endpoints
│   │   │   ├── payments/      # Payment processing
│   │   │   └── zoom/          # Video meeting integration
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── admin/         # Admin dashboard with analytics
│   │   │   ├── doctor/        # Doctor dashboard with appointments
│   │   │   └── patient/       # Patient dashboard with bookings
│   │   ├── login/             # Login page with split-screen design
│   │   ├── register/          # Registration page with animations
│   │   ├── about/             # About page with company info
│   │   ├── contact/           # Contact page with form
│   │   ├── globals.css        # Global styles and Tailwind imports
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Homepage with animated sections
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   │   ├── AuthBackground.tsx  # Unified background with patterns
│   │   │   ├── LoginForm.tsx       # Login form with validation
│   │   │   └── RegisterForm.tsx    # Registration form with role fields
│   │   ├── home/             # Homepage components
│   │   │   ├── Header.tsx          # Navigation with functional links
│   │   │   ├── HeroSection.tsx     # Hero with call-to-action
│   │   │   ├── FeaturesSection.tsx # Features with hover animations
│   │   │   ├── HowItWorksSection.tsx # Interactive timeline
│   │   │   ├── ServicesSection.tsx # Services grid with animations
│   │   │   ├── TestimonialsSection.tsx # Customer testimonials
│   │   │   ├── StatsSection.tsx    # Animated statistics
│   │   │   ├── CTASection.tsx      # Call-to-action section
│   │   │   └── Footer.tsx          # Footer with links
│   │   ├── layout/           # Layout components
│   │   └── ui/               # Shadcn/ui component library
│   │       ├── button.tsx         # Button component
│   │       ├── card.tsx           # Card component
│   │       ├── input.tsx          # Input component
│   │       ├── label.tsx          # Label component
│   │       ├── select.tsx         # Select component
│   │       ├── textarea.tsx       # Textarea component
│   │       └── toast-helper.tsx   # Toast notifications
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── models/           # Database models
│   │   │   ├── User.ts           # User model with roles
│   │   │   ├── Appointment.ts    # Appointment model
│   │   │   └── Payment.ts        # Payment model
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── db.ts             # Database connection
│   │   ├── email.ts          # Email service configuration
│   │   ├── paystack.ts       # Payment integration
│   │   ├── zoom.ts           # Video meeting utilities
│   │   └── utils.ts          # General utilities
│   └── scripts/              # Database seeding scripts
│       └── seed-users.ts     # Initial user seeding
├── public/                   # Static assets
├── .env.local               # Environment variables
├── .env.example             # Environment variables template
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
├── components.json          # Shadcn/ui configuration
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- **Node.js 18+** and npm/yarn
- **MongoDB** database (local or cloud)
- **Zoom Developer Account** (optional for video consultations)
- **Paystack Account** (optional for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doctor_appointment_app-3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/Medynx
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   
   # File Upload Service
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   
   # Video Consultation (Zoom API)
   ZOOM_CLIENT_ID=your_zoom_client_id
   ZOOM_CLIENT_SECRET=your_zoom_client_secret
   ZOOM_ACCOUNT_ID=your_zoom_account_id
   
   # Payment Processing (Paystack)
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret
   PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
   
   # Email Service (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Application URLs
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Seed initial admin user and demo data
   npm run seed-users
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Models

### User Model
```typescript
interface IUser {
  _id: ObjectId
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: "patient" | "doctor" | "admin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  
  // Patient-specific fields
  dateOfBirth?: Date
  gender?: "Male" | "Female"
  address?: string
  
  // Doctor-specific fields
  specialization?: string
  licenseNumber?: string
  experience?: number
  bio?: string
  rating?: number
  consultationFee?: number
  isVerified?: boolean
  availability?: {
    day: string
    timeSlots: string[]
  }[]
}
```

### Appointment Model
```typescript
interface IAppointment {
  _id: ObjectId
  patient: ObjectId
  doctor: ObjectId
  date: Date
  timeSlot: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  type: "video"
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  paymentStatus: "pending" | "paid" | "refunded"
  amount: number
  currency: string
  zoomMeetingId?: string
  zoomJoinUrl?: string
  zoomPassword?: string
  createdAt: Date
  updatedAt: Date
}
```

### Payment Model
```typescript
interface IPayment {
  _id: ObjectId
  appointment: ObjectId
  patient: ObjectId
  doctor: ObjectId
  amount: number
  currency: string
  status: "pending" | "successful" | "failed" | "refunded"
  paymentMethod: "paystack" | "stripe" | "bank_transfer"
  transactionId: string
  reference: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 UI/UX Features

### Modern Design System
- **Animated Homepage**: Framer Motion powered animations with scroll-triggered effects
- **Split-screen Authentication**: Beautiful login/register pages with animated backgrounds
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Component Architecture**: Modular, reusable components for maintainability
- **Dark Mode Support**: System preference detection with manual toggle
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

### Animation Features
- **Scroll Animations**: Elements animate when scrolled into view (both directions)
- **Interactive Timeline**: Animated "How It Works" section with step-by-step process
- **Hover Effects**: Smooth transitions and micro-interactions on all interactive elements
- **Loading States**: Animated loading indicators and skeleton screens
- **Background Patterns**: Dynamic SVG patterns with floating elements
- **Page Transitions**: Smooth transitions between pages and sections
- **Staggered Animations**: Sequential element animations with configurable delays

### Authentication UI
- **Unified Background**: Single AuthBackground component with different patterns
- **Circuit Pattern**: Tech-focused design for login page with grid animations
- **Diamond Pattern**: Welcoming geometric design for registration page
- **Glass Morphism**: Modern backdrop blur effects with transparency
- **Responsive Forms**: Mobile-optimized form layouts with validation
- **Demo Accounts**: Pre-configured demo accounts for testing different roles

### Component Features
- **Header**: Functional navigation with smooth scroll and active states
- **Hero Section**: Animated call-to-action with statistics counters
- **Features**: Interactive cards with hover animations and icons
- **Timeline**: Step-by-step process with animated progress line
- **Services**: Grid layout with animated service cards
- **Testimonials**: Customer reviews with animated star ratings
- **Statistics**: Animated counters with scroll-triggered counting
- **Footer**: Comprehensive site links with hover effects

## 🔐 Authentication & Authorization

### Authentication Flow
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Three distinct user roles with specific permissions
- **Password Security**: bcrypt hashing with salt rounds for password protection
- **Session Management**: Automatic token refresh and logout on expiration

### Route Protection
- **Public Routes**: `/`, `/about`, `/contact`, `/login`, `/register`
- **Protected Routes**: All `/dashboard/*` routes require authentication
- **Role-Based Access**: 
  - `/dashboard/admin/*` - Admin only (user management, system stats)
  - `/dashboard/doctor/*` - Doctor only (appointments, patient records)
  - `/dashboard/patient/*` - Patient only (bookings, medical history)

### Security Features
- **Input Validation**: Zod schema validation on all forms
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Sanitization**: Input sanitization to prevent XSS attacks

## 🎯 API Endpoints

### Authentication Endpoints
```typescript
POST /api/auth/register    // User registration with role selection
POST /api/auth/login       // User login with credentials
POST /api/auth/logout      // User logout and token invalidation
GET  /api/auth/me          // Get current authenticated user
POST /api/auth/refresh     // Refresh JWT token
POST /api/auth/forgot      // Password reset request
POST /api/auth/reset       // Password reset confirmation
```

### User Management
```typescript
GET    /api/users          // List all users (admin only)
GET    /api/users/[id]     // Get user by ID
PUT    /api/users/[id]     // Update user profile
DELETE /api/users/[id]     // Delete user (admin only)
POST   /api/users/verify   // Verify doctor account (admin only)
```

### Appointment Management
```typescript
GET    /api/appointments           // List user appointments
POST   /api/appointments           // Create new appointment
GET    /api/appointments/[id]      // Get appointment details
PUT    /api/appointments/[id]      // Update appointment
DELETE /api/appointments/[id]      // Cancel appointment
POST   /api/appointments/[id]/join // Join video consultation
```

### Doctor Endpoints
```typescript
GET  /api/doctors              // List all verified doctors
GET  /api/doctors/[id]         // Get doctor profile and availability
PUT  /api/doctors/[id]         // Update doctor profile
GET  /api/doctors/[id]/slots   // Get available time slots
POST /api/doctors/[id]/review  // Add doctor review
```

### Payment Endpoints
```typescript
POST /api/payments/initialize  // Initialize payment with Paystack
POST /api/payments/verify      // Verify payment status
POST /api/payments/webhook     // Handle payment webhooks
GET  /api/payments/history     // Get payment history
POST /api/payments/refund      // Process refund (admin only)
```

### Video Consultation
```typescript
POST /api/zoom/create-meeting  // Create Zoom meeting
GET  /api/zoom/meeting/[id]    // Get meeting details
POST /api/zoom/join-meeting    // Generate join URL
DELETE /api/zoom/meeting/[id]  // End meeting
```

## 🚀 Deployment

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for production
pm2 start npm --name "Medynx" -- start
```

### Environment Variables for Production
```env
# Production Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Medynx

# Strong JWT Secret (32+ characters)
JWT_SECRET=your-production-jwt-secret-key-32-characters-minimum

# Production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Production API Keys
PAYSTACK_SECRET_KEY=sk_live_your_live_secret
ZOOM_CLIENT_ID=your_production_zoom_client_id

# Email Configuration
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-email
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **AWS**: EC2 or Elastic Beanstalk for custom deployments
- **DigitalOcean**: App Platform or Droplets
- **Railway**: Simple deployment with database included

## 🧪 Development Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint with Next.js rules
npm run lint:fix     # Fix ESLint errors automatically
npm run type-check   # Run TypeScript type checking
npm run seed-users   # Seed database with initial users
npm run clean        # Clean build artifacts
```

## 🎯 Component Architecture

### Homepage Components
The homepage is built with modular, animated components:

- **Header**: Navigation with functional links and mobile menu
- **HeroSection**: Animated hero with call-to-action and statistics
- **FeaturesSection**: Feature showcase with hover animations and icons
- **HowItWorksSection**: Interactive timeline with step-by-step process
- **ServicesSection**: Service grid with animated cards and emergency care
- **TestimonialsSection**: Customer testimonials with animated star ratings
- **StatsSection**: Animated statistics counters with scroll triggers
- **CTASection**: Final call-to-action with gradient background
- **Footer**: Comprehensive site links and company information

### Authentication Components
Modular authentication system with reusable components:

- **AuthBackground**: Unified background component with different patterns
  - Circuit pattern for login (tech-focused with grid animations)
  - Diamond pattern for register (welcoming geometric design)
- **LoginForm**: Login form with validation, demo accounts, and error handling
- **RegisterForm**: Registration form with role-based fields and dynamic validation

### Animation System
- **Scroll-triggered animations**: Elements animate when scrolled into view (both directions)
- **Staggered animations**: Sequential element animations with configurable delays
- **Hover interactions**: Smooth hover effects on all interactive elements
- **Loading states**: Animated loading indicators and skeleton screens
- **Floating elements**: Continuous background animations with physics
- **Page transitions**: Smooth transitions between routes and sections

### UI Component Library
Built on Radix UI with custom styling:

- **Button**: Multiple variants with loading states and icons
- **Card**: Flexible card component with header, content, and footer
- **Input**: Form input with validation states and icons
- **Select**: Dropdown select with search and multi-select options
- **Textarea**: Multi-line text input with auto-resize
- **Toast**: Notification system with success, error, and info states
- **Modal**: Accessible modal dialogs with backdrop and animations

## 🔧 Configuration Files

- **next.config.ts** - Next.js configuration with Turbopack and optimizations
- **tailwind.config.js** - Tailwind CSS configuration with custom colors and animations
- **tsconfig.json** - TypeScript configuration with strict mode
- **eslint.config.mjs** - ESLint configuration with Next.js and TypeScript rules
- **components.json** - Shadcn/ui component configuration
- **.env.example** - Environment variables template
- **package.json** - Dependencies, scripts, and project metadata

## 🧪 Testing

### Test Structure
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Testing Tools
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Cypress** - End-to-end testing
- **MSW** - API mocking for tests

## 📈 Performance Optimizations

- **Next.js 15** with Turbopack for faster development builds
- **Image Optimization** with Next.js Image component
- **Code Splitting** with dynamic imports and lazy loading
- **Bundle Analysis** with @next/bundle-analyzer
- **Caching Strategies** for API responses and static assets
- **Database Indexing** for optimized queries
- **CDN Integration** for static asset delivery

## 🔒 Security Features

- **Input Validation** with Zod schemas on all forms
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with input sanitization
- **CSRF Protection** with token validation
- **Rate Limiting** on API endpoints
- **Secure Headers** with Next.js security headers
- **Environment Variable Protection** with validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- ## 📞 Support

For support and questions:
- **Email**: medynxcare@gmail.com
- **Phone**: +1 (555) 123-4567
- **Documentation**: [docs.Medynx.com](https://docs.Medynx.com)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/Medynx/issues)
- **Discord Community**: [Join our community](https://discord.gg/Medynx)

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Framer Motion** - For smooth and powerful animations
- **Radix UI** - For accessible and customizable components
- **Tailwind CSS** - For utility-first CSS framework
- **MongoDB** - For flexible and scalable database
- **Vercel** - For seamless deployment and hosting
- **Open Source Community** - For the incredible tools and libraries

---

**Medynx** - Your trusted healthcare companion for booking appointments and managing your health with modern technology and beautiful animations. -->

