# 🚀 Server-Rendered E-commerce Admin Dashboard

A **production-style, server-rendered (SSR) admin dashboard** for managing products, inventory, pricing, and analytics in an e-commerce system — built with **Next.js App Router** and modern web best practices.

---

## 📌 Overview

This project demonstrates how a **real-world e-commerce admin panel** is built in industry:

- Fast server-side rendering (SSR)
- Clean, scalable architecture
- Professional UI/UX
- Secure admin access
- Advanced data tables and analytics

It mirrors how internal admin dashboards are built in real companies.

---

## 🎯 Objectives

- Build a **high-performance SSR dashboard**
- Implement **complete product CRUD**
- Add **data analytics & visualization**
- Deliver a **professional admin UX**
- Follow **industry-level folder structure & patterns**

---

## ✨ Features

### 🧩 Product Management (CRUD)
- Create, edit, delete products
- Category-based organization
- Stock and price management
- Image upload using **Cloudinary**
- Strong input validation using **Zod**

### 📊 Analytics & Insights
- Stock per category (Bar Chart)
- Price distribution (Pie Chart)
- Responsive charts with animations

### 🔍 Advanced Product Table
- Search by name or category
- Category filter
- Sortable columns
- Pagination
- Column visibility toggle
- Skeleton loaders
- Empty state handling

### 🔐 Secure Admin Access
- Login-protected admin routes
- Middleware-based route guarding

### 🎨 Professional UI / UX
- Collapsible sidebar (persistent)
- Sticky navbar
- Responsive layout
- Toast notifications

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Rendering:** Server-Side Rendering (SSR)
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **ORM:** Mongoose
- **Validation:** Zod
- **Charts:** Recharts
- **Image Storage:** Cloudinary
- **State Management:** React Hooks + Context
- **Deployment:** Vercel

---

## 📁 Folder Structure

```text
src/
├── app/
│   ├── api/products/
│   ├── login/
│   ├── products/[id]/edit/
│   ├── products/new/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── ProductTable.tsx
│   ├── ProductCharts.tsx
│   ├── StatsCards.tsx
│   └── ui/UIContext.tsx
├── lib/
│   ├── db.ts
│   ├── cloudinary.ts
│   └── validators/
├── models/product.ts
├── public/fallback.png
└── styles/globals.css
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/ecommerce-admin-dashboard.git
cd ecommerce-admin-dashboard
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4️⃣ Run Locally
```bash
npm run dev
```

Open http://localhost:3000

---

## 🙌 Author

**Krish Goyal**  
Built as a production-ready e-commerce admin dashboard using Next.js.
