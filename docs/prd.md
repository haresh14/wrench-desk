# Product Requirement Document (PRD) - WrenchDesk

## 1. Project Overview
WrenchDesk is a comprehensive Field Service Management (FSM) platform designed for small to medium-sized service businesses (plumbing, HVAC, electrical, etc.). It streamlines scheduling, customer management, and billing in a single, intuitive interface.

## 2. Target Audience
- Service business owners
- Technicians
- Office administrators

## 3. Core Features

### 3.1. Authentication
- Secure login and signup using Supabase Auth.
- Protected dashboard routes.

### 3.2. Dashboard
- Real-time overview of business performance.
- Key metrics: Today's Jobs, Active Customers, Unpaid Invoices, and Monthly Revenue.
- Upcoming schedule feed.
- Recent activity log.

### 3.3. Schedule Management
- Calendar-style view of all appointments.
- Create, edit, and delete appointments.
- Assign technicians and job types.
- Status tracking (Scheduled, In Progress, Completed, Cancelled).

### 3.4. Customer Management
- Centralized database of all clients.
- Detailed customer profiles including contact info and service history.
- Search and filter capabilities.

### 3.5. Invoicing & Billing
- Generate invoices directly from jobs.
- Track payment status (Paid, Pending, Overdue).
- Search invoices by number, customer, or status.
- Export invoice data to CSV for accounting.

### 3.6. Settings
- Manage company profile (Name, Address, Service Areas).
- User profile management.

## 4. Technical Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Animations**: Motion (framer-motion)
- **Icons**: Lucide React

## 5. Future Enhancements
- Mobile app for technicians.
- Real-time GPS tracking.
- Automated SMS/Email notifications for customers.
- Integration with payment gateways (Stripe/PayPal).
