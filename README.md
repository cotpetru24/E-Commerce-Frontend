# ShoeStore – Angular Frontend (Admin + Customer)

Angular frontend for a **full-stack e-commerce and admin platform**, built as a **portfolio / CV project**.

This application is designed to demonstrate **real-world frontend engineering practices**, including strict typing, admin-driven workflows, and consistent frontend–backend contracts.
It is not a UI mock or demo app.

The backend (ASP.NET Core Web API + PostgreSQL) is implemented in a separate repository.

---

## Overview

This frontend consumes a real REST API and implements both **customer-facing** and **admin-facing** functionality.

The focus of this project is:
- correctness
- consistency
- maintainability
- realistic workflows

rather than feature bloat or visual experimentation.

---

## Customer Features

- Product browsing
- Product details with size availability
- Cart management
- Checkout flow
- Stripe payment integration
- Order history

---

## Admin Features

### User Management
- View users
- Role-based access (admin vs customer)
- Admin-only routes and guards

### Product Management
- Product CRUD
- Size-based variants (UK shoe sizes)
- Stock tracked per size
- Barcode per size
- Derived SKU generation
- Product images with fallback (“image coming soon”)
- Active / inactive products

### Inventory & Insights
- Aggregated stock per product
- Low-stock and out-of-stock indicators
- Revenue statistics with date filtering

### Order Management
- View all orders
- Order details (items, sizes, totals)
- Order status lifecycle handling

### CMS (Landing Page Management)
- Hero content configuration
- Feature list management
- Category list management
- Theme colors (navbar & footer)
- Multiple CMS profiles (e.g. Default / Seasonal)
- Activate CMS profiles at runtime without redeploy

---

## Key Frontend Design Decisions

- **Strict TypeScript configuration**
  - DTO mismatches are surfaced at compile time
  - No silent `any` or unsafe casts

- **Explicit frontend contracts**
  - Frontend DTOs mirror backend responses
  - No hidden mapping layers

- **Standalone Angular components**
  - Clear ownership per feature
  - No monolithic NgModules

- **No fake UI data**
  - Admin and customer flows use real API responses

---

## Tech Stack

- Angular (standalone components)
- TypeScript (strict mode)
- Bootstrap + Bootstrap Icons
- RxJS
- Stripe JS

---

## Project Structure

src/
  app/
    admin/
      user-management/
      product-management/
      order-management/
      content-management/
    customer/
    shared/
    services/
    models/

Admin and customer concerns are intentionally separated.

---

## Running Locally

### Prerequisites
- Node.js (LTS recommended)
- Angular CLI (optional)

### Install & Run

npm install
ng serve

The application expects the backend API to be running and reachable.
Refer to the backend repository for API and database setup.

---

## Testing

- Angular TestBed
- HttpClientTestingModule
- Focused component and service tests

Tests target **business-critical paths**, not snapshot or boilerplate coverage.

---

## Scope & Intent

This project intentionally avoids:
- over-abstracted state management
- unnecessary UI frameworks
- mock-only demo data

The focus is on:
- maintainable frontend architecture
- realistic admin tooling
- clean contracts with the backend

---

## Status

- Feature-complete for portfolio use
- Codebase cleaned and aligned after refactoring
- Suitable for mid-to-senior level technical review

---

## Notes

This repository contains **frontend code only**.
Backend API, authentication, and database logic are implemented in a separate repository.
