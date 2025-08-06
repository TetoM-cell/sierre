# KPI Tracker App

A modern, minimalist KPI tracker application built with Next.js, React, Supabase (backend), and Clerk for authentication. This app follows an Apple-inspired design philosophy, focusing on simplicity, subtle animations, and delightful user experience while prioritizing core functionality for ecommerce businesses.

## ✨ Features

### 🎯 **Core KPI Management**
- ✅ **Complete CRUD Operations** - Create, read, update, and delete KPI entries with full validation
- ✅ **Advanced KPI Types** - Support for currency, percentage, count, and ratio metrics
- ✅ **Dynamic Categories** - Organize KPIs with customizable categories and color-coded systems
- ✅ **Smart Tags System** - Tag-based organization and filtering for better KPI management
- ✅ **Progress Tracking** - Visual progress bars and target achievement indicators
- ✅ **Trend Analysis** - Historical data visualization with mini charts

### 📊 **Dashboard & Analytics**
- ✅ **Real-time Dashboard** - Live KPI overview with key performance metrics
- ✅ **Interactive Charts** - Responsive charts with hover states and trend indicators
- ✅ **Statistics Overview** - Quick insights on total KPIs, on-track metrics, and performance
- ✅ **Empty States** - Intuitive onboarding for new users with guided setup
- 🔄 **Advanced Filtering** - Time range and category filters (Phase 2)
- 🔄 **Custom Dashboards** - Drag-and-drop customization (Phase 2)

### 🔐 **Authentication & User Management**
- 🔄 **Secure Login** - Clerk-powered OAuth and session management
- 🔄 **User Profiles** - Complete profile management with avatar upload
- 🔄 **Multi-user Support** - Team collaboration features

### 🔗 **Integrations**
- ✅ **Integration Architecture** - Ready-to-connect platform framework
- ✅ **Platform Support** - Shopify, Etsy, WooCommerce, Squarespace ready
- 🔄 **Live Data Sync** - Real-time data synchronization from connected platforms
- 🔄 **OAuth Workflows** - Secure platform authentication flows

### 🎨 **User Experience**
- ✅ **Modal System** - Comprehensive modal framework with validation
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Toast Notifications** - Success, error, and info notifications
- ✅ **Responsive Design** - Mobile-first design with smooth animations
- ✅ **Loading States** - Skeleton loaders and progress indicators
- ✅ **Accessibility** - Keyboard navigation and screen reader support

## 🛠 Tech Stack

**Frontend:**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling framework

**Backend:**
- **Supabase** - PostgreSQL database with real-time API
- **Clerk** - Authentication and user management

**Data Visualization:**
- **Recharts** - Responsive chart library for KPI visualization

**State Management:**
- **React Context** - Global state management
- **Custom Hooks** - Reusable business logic

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase project with configured tables
- Clerk account with domain whitelisted

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TetoM-cell/sierre.git
   cd kpi-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   ```

4. **Database Schema**
   Set up your Supabase database with the following tables:
   ```sql
   -- Users table (handled by Clerk)
   -- KPIs table
   CREATE TABLE kpis (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     name TEXT NOT NULL,
     value DECIMAL NOT NULL,
     target DECIMAL NOT NULL,
     unit TEXT NOT NULL,
     unit_symbol TEXT,
     category TEXT NOT NULL,
     tags TEXT[],
     trend TEXT DEFAULT 'neutral',
     change_percent DECIMAL DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- KPI History table
   CREATE TABLE kpi_history (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
     value DECIMAL NOT NULL,
     recorded_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Categories table
   CREATE TABLE categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     name TEXT NOT NULL,
     color TEXT DEFAULT '#6b7280',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Usage

### Getting Started
1. **Sign Up/Login** - Create your account using Clerk authentication
2. **Create Your First KPI** - Click "Add KPI" to start tracking your metrics
3. **Set Targets** - Define realistic targets for each KPI
4. **Monitor Progress** - Track your performance with visual indicators

### KPI Management
- **Add KPIs** - Use the comprehensive form to create new metrics
- **Edit Values** - Update current values and targets as needed
- **Organize** - Use categories and tags for better organization
- **Delete** - Remove outdated KPIs with confirmation protection

### Dashboard Features
- **Overview Stats** - Quick insights into your KPI performance
- **Visual Charts** - Historical trends and progress visualization
- **Progress Tracking** - Color-coded indicators for target achievement
- **Responsive Design** - Seamless experience across all devices

## 🗺 Development Roadmap

### ✅ **Phase 1: Foundation** (Completed)
- [x] State management architecture
- [x] Complete CRUD operations
- [x] Form validation system
- [x] Modal framework
- [x] Basic dashboard layout
- [x] KPI cards with charts
- [x] Toast notifications

### 🔄 **Phase 2: Interactivity** (In Progress)
- [ ] Advanced filtering and search
- [ ] Interactive chart enhancements
- [ ] Dashboard customization
- [ ] Bulk operations
- [ ] Export/import functionality

### 📋 **Phase 3: Integrations** (Planned)
- [ ] Shopify integration
- [ ] Etsy marketplace sync
- [ ] WooCommerce connection
- [ ] Squarespace integration
- [ ] Custom API endpoints

### 🎨 **Phase 4: Polish** (Planned)
- [ ] Advanced animations
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Team collaboration features

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure accessibility compliance
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Supabase** - For the backend infrastructure
- **Clerk** - For authentication services
- **Tailwind CSS** - For the utility-first CSS framework
- **Recharts** - For beautiful, responsive charts

## 📞 Support

If you need help or have questions:

- 📧 Email: support@kpitracker.app
- 💬 GitHub Issues: [Create an issue](https://github.com/yourusername/kpi-tracker/issues)
- 📖 Documentation: [View docs](https://docs.kpitracker.app)

---

**Built with ❤️ for ecommerce entrepreneurs who value data-driven decisions.**