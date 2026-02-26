# WrenchDesk - Field Service Management Platform

WrenchDesk is a modern, all-in-one platform for field service businesses to manage their customers, schedules, and billing.

## 📖 Documentation
- [Product Requirement Document (PRD)](docs/prd.md)

## Live Demo
https://wrench-desk.vercel.app

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account

### Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API (Optional for AI features)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

#### Where to find these values:
1. **Supabase URL & Anon Key**: Go to your Supabase Project Settings > API.
2. **Service Role Key**: Go to your Supabase Project Settings > API (Keep this secret!).
3. **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Database Setup
1. Create a new Supabase project.
2. Run the SQL scripts found in `supabase/schema.sql` in the Supabase SQL Editor to set up the tables and RLS policies.
3. (Optional) Run `supabase/seed.sql` to populate the database with test data.

## 🌐 Deployment

### Vercel
WrenchDesk is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Add the environment variables listed above in the Vercel project settings.
4. Vercel will automatically detect Next.js and deploy your application.

## 🛡 License
This project is licensed under the MIT License.
