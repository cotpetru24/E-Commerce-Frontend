# ShoeStore – Full Stack E-Commerce Demo (Angular + ASP.NET Core)

A portfolio full-stack e-commerce web app built with **Angular** (frontend) and **ASP.NET Core Web API** + **PostgreSQL** (backend).  
Includes product management with **sizes**, inventory stock tracking, **Stripe payments**, admin dashboard stats, and a simple **CMS** for landing page configuration.

> This is a CV/portfolio project focused on clean architecture, consistency, and real-world workflows.

---

## Features

### Customer
- Browse products
- Product details
- Cart + checkout flow
- Stripe payment integration
- View orders

### Admin
- Product CRUD
- Product images (supports “image coming soon” fallback)
- Size-based stock management (UK size model)
- Barcode + SKU per size
- Inventory signals (low stock / out of stock)
- Revenue stats + date filtering
- CMS: landing page content + colors + feature/category lists
- Save/activate CMS profiles (e.g. Christmas / Default theme)

---

## Tech Stack

**Frontend**
- Angular (standalone components)
- Bootstrap + icons
- Stripe JS (client)

**Backend**
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- ASP.NET Identity + JWT auth
- Stripe (server integration)

---

## Repo Layout

- `ShoeStore` / `ShoeStore.DataContext.PostgreSQL` – backend API + EF/Postgres context
- `src/` – Angular frontend

(If you keep them as separate repos, update this section accordingly.)

---

## Getting Started (Local)

### Prerequisites
- Node.js (LTS recommended)
- Angular CLI (optional)
- .NET SDK (matching your solution version)
- PostgreSQL

---

## Backend Setup (ASP.NET Core)

1. Configure your connection string and secrets
   - Use `appsettings.Development.json` (recommended)
   - Or environment variables

2. Create database + run migrations (example)
   - If using EF migrations, run:
     ```bash
     dotnet restore
     dotnet ef database update
     ```

3. Run the API:
   ```bash
   dotnet run --project ShoeStore/ShoeStore.csproj
