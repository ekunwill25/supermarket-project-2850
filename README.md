# COMP2850 Supermarket Web Application

A full-stack online supermarket web application built for the COMP2850 module. The system provides three distinct portals for customers, warehouse staff, and management/marketing teams, each tailored to the specific needs of that user group.

### Action Workflows

[![Backend CI](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/backend.yml/badge.svg)](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/backend.yml)
[![Frontend CI](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/frontend.yml/badge.svg)](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/frontend.yml)

---

## 👥 Team

| Name | Role |
|------|------|
| Tanuushre Vejayan | Frontend Lead |
| Geoffrey Tong | Backend Lead |
| Chen When | Full Stack |
| Ekundayo William Ladepo | Full Stack |

---

## 🧩 System Overview

The application is split into three subsystems:

- **E-Commerce** — Customers can browse and search products by category, manage a shopping basket with promo codes and VAT breakdown, check out with delivery scheduling, and view their full order history with live status tracking.
- **Warehousing** — Warehouse staff access picking lists sorted by shelf location on mobile or tablet, update stock levels in real time, flag substitutions or out-of-stock items, and process incoming deliveries. *(In progress)*
- **Management & Marketing** — Staff can view sales metrics, identify trending and best-selling products, and export reports — all filterable by product, category and date range. *(In progress)*

---

## 🛠️ Tech Stack

| Technology | Purpose | Notes |
|------------|---------|-------|
| Kotlin + Spring Boot | Backend REST API | Switched from Ktor for better JPA and database integration |
| Spring Data JPA | ORM layer | Maps Kotlin data classes to H2/SQLite tables |
| H2 (in-memory) | Database | File-based, no setup required — seeded from `data.sql` on startup |
| HTML | Frontend markup | Core structure for all portal pages |
| CSS | Frontend styling | Custom styles layered on top of Bootstrap |
| Bootstrap 5 | UI component framework | Replaced Tailwind CSS following supervisor recommendation |
| JavaScript | Frontend interactivity | Dynamic rendering, basket management, fetch API calls |

---

## 📄 Frontend Pages

### Customer Portal ✅ Complete
| Page | File | Description |
|------|------|-------------|
| Portal Selection | `frontend/index.html` | Landing page — select Customer, Warehouse or Management portal |
| Home | `frontend/src/pages/customer/index.html` | Hero banner, category grid, sale/featured/trending sections |
| Products | `frontend/src/pages/customer/products.html` | Full catalogue with sidebar filters, sort, search and favourites |
| Basket | `frontend/src/pages/customer/basket.html` | Basket management, promo codes, VAT breakdown, delivery tracker |
| Checkout | `frontend/src/pages/customer/checkout.html` | Address, delivery method, payment, order summary |
| Orders | `frontend/src/pages/customer/orders.html` | Order history with status filters, progress bar and detail modal |
| Login | `frontend/src/pages/customer/login.html` | Role-based login with demo account shortcuts |
| Sign Up | `frontend/src/pages/customer/signup.html` | Customer registration with live password strength indicator |

### Warehouse Portal 🔄 In Progress
| Page | File | Description |
|------|------|-------------|
| Home | `frontend/src/pages/warehouse/index.html` | Warehouse dashboard |
| Picking List | `frontend/src/pages/warehouse/picking-list.html` | Order picking sorted by shelf location |
| Stock | `frontend/src/pages/warehouse/stock.html` | Stock level management |
| Deliveries | `frontend/src/pages/warehouse/deliveries.html` | Incoming delivery processing |

### Management Portal 🔄 In Progress
| Page | File | Description |
|------|------|-------------|
| Home | `frontend/src/pages/management/index.html` | Management dashboard |
| Sales | `frontend/src/pages/management/sales.html` | Sales metrics and trend charts |
| Products | `frontend/src/pages/management/products.html` | Best-selling and trending analysis |
| Export | `frontend/src/pages/management/export.html` | CSV/PDF data export |

---

## 🗄️ Backend API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/products` | Returns all active products | ✅ Live |
| GET | `/products/{id}` | Returns a single product by ID | ✅ Live |
| GET | `/categories` | Returns all product categories | ✅ Live |
| GET | `/customers` | Returns all customers | ✅ Live |
| GET | `/customers/{id}` | Returns a single customer by ID | ✅ Live |
| POST | `/customers` | Creates a new customer account | ✅ Live |
| GET | `/inventory` | Returns all stock levels | ✅ Live |
| POST | `/auth/login` | Authenticates a customer | 🔄 In progress |
| GET | `/orders` | Returns all orders | 🔄 In progress |
| POST | `/orders` | Places a new order | 🔄 In progress |
| GET | `/cart/{customerId}` | Returns a customer's basket | 🔄 In progress |
| POST | `/cart` | Adds an item to a basket | 🔄 In progress |

---

## 📁 Project Structure

```
supermarket-project-2850/
├── .github/
│   └── workflows/
│       ├── backend.yml          ← Kotlin Spring Boot CI pipeline
│       └── frontend.yml         ← HTML/CSS/JS CI pipeline
├── Backend-SupermarketDatabase/
│   └── src/main/
│       ├── kotlin/com/supermarket/
│       │   ├── CorsConfig.kt            ← CORS config for frontend access
│       │   ├── SupermarketDatabaseApplication.kt
│       │   ├── controller/              ← REST API controllers
│       │   │   ├── ProductController.kt
│       │   │   ├── CategoryController.kt
│       │   │   ├── CustomerController.kt
│       │   │   └── InventoryController.kt
│       │   ├── model/                   ← JPA data classes
│       │   │   ├── Product.kt
│       │   │   ├── Category.kt
│       │   │   ├── Customer.kt
│       │   │   ├── Order.kt
│       │   │   ├── OrderItem.kt
│       │   │   ├── Cart.kt
│       │   │   ├── CartItem.kt
│       │   │   ├── Payment.kt
│       │   │   ├── Address.kt
│       │   │   ├── Inventory.kt
│       │   │   ├── Employee.kt
│       │   │   └── Supplier.kt
│       │   └── repository/              ← Spring Data JPA repositories
│       │       ├── ProductRepository.kt
│       │       ├── CategoryRepository.kt
│       │       ├── CustomerRepository.kt
│       │       └── InventoryRepository.kt
│       └── resources/
│           ├── application.properties   ← Spring Boot config
│           └── data.sql                 ← Seed data (82 products, 12 categories)
├── frontend/
│   ├── index.html                       ← Portal selection landing page
│   └── src/
│       ├── css/
│       │   └── styles.css
│       ├── js/
│       │   └── portal.js
│       └── pages/
│           ├── customer/
│           │   ├── index.html
│           │   ├── products.html
│           │   ├── basket.html
│           │   ├── checkout.html
│           │   ├── orders.html
│           │   ├── login.html
│           │   └── signup.html
│           ├── warehouse/
│           │   ├── index.html
│           │   ├── picking-list.html
│           │   ├── stock.html
│           │   └── deliveries.html
│           └── management/
│               ├── index.html
│               ├── sales.html
│               ├── products.html
│               └── export.html
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- [JDK 17](https://adoptium.net/) (Temurin recommended)
- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Firefox, Edge)

> No Node.js or database installation required — the frontend is plain HTML/CSS/JS, and the database is seeded automatically on startup.

---

### 1. Clone the Repository

```bash
git clone https://github.com/ekunwill25/supermarket-project-2850.git
cd supermarket-project-2850
```

---

### 2. Running the Backend

```bash
cd Backend-SupermarketDatabase

# macOS / Linux
./gradlew bootRun

# Windows
.\gradlew.bat bootRun
```

The API will be available at `http://localhost:8080`

The database is seeded automatically from `src/main/resources/data.sql` on first run — 82 products across 12 categories, no manual setup required.

---

### 3. Running the Frontend

The frontend is plain HTML — no build step or `npm install` needed.

**Option A — Open directly in browser:**
Navigate to `frontend/index.html` and open it in your browser.

**Option B — Use VS Code Live Server (recommended):**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right click `frontend/index.html` → **Open with Live Server**
3. The app will open at `http://127.0.0.1:5500`

> Make sure the backend is running first so the frontend can fetch live product and category data from `http://localhost:8080`.

---

### 4. Demo Accounts

Use these accounts to test all three portals without registering:

| User | Email | Password | Portal |
|------|-------|----------|--------|
| Dave (Customer) | `dave@freshmart.com` | `customer123` | Customer Portal |
| Sarah (Warehouse) | `sarah@freshmart.com` | `warehouse123` | Warehouse Portal |
| Emma (Management) | `emma@freshmart.com` | `manager123` | Management Portal |

These are also available as quick-fill buttons on the login page.

---

### 5. Running Backend Tests

```bash
cd Backend-SupermarketDatabase

# macOS / Linux
./gradlew test

# Windows
.\gradlew.bat test
```

---

## 🌿 Branching Strategy

- `main` — stable, protected branch. All changes go through pull requests.
- `feature/team/your-feature-name` — for new features
- `fix/your-fix-name` — for bug fixes

All pull requests must pass CI checks before merging. At least 2 team member approvals are required to merge into `main`.

---

## 📖 Documentation

Full documentation is available on the [GitHub Wiki](https://github.com/ekunwill25/supermarket-project-2850/wiki), including:

- Personas & Job Stories
- Wireframes & UI Design
- UX Thinking & Testing
- Database & Class Diagrams
- Design & Planning (weekly log)
- Meeting Notes & Retrospectives
- Testing Strategy
