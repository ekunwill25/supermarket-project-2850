# COMP2850 Supermarket Web Application

A full-stack online supermarket web application built as part of the COMP2850 module at the University of Leeds. The system provides three distinct portals for customers, warehouse staff, and management/marketing teams, each tailored to the specific needs and workflows of that user group.

### Action Workflows

[![Backend CI](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/backend.yml/badge.svg)](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/backend.yml)
[![Frontend CI](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/frontend.yml/badge.svg)](https://github.com/ekunwill25/supermarket-project-2850/actions/workflows/frontend.yml)

---

## 👥 Team

| Name | Role |
| --- | --- |
| Tanuushre Vejayan | Frontend Lead |
| Geoffrey Tong | Backend Lead |
| Weiru Chen | Full Stack |
| Ekundayo William Ladepo | Full Stack |

---

## 🧩 System Overview

The application is split into three subsystems:

- **E-Commerce** — Customers can browse products by category, search and filter the product catalogue, manage a shopping basket, apply promo codes, check out with delivery scheduling, and view their full order history with live status tracking.
- **Warehousing** — Warehouse staff access picking lists sorted by shelf location on mobile or tablet, update stock levels in real time, flag substitutions or out-of-stock items, and process incoming deliveries.
- **Management & Marketing** — Staff can view sales metrics and trends, identify best-selling and trending products by category, and export reports — all filterable by product, category and date range.

---

## 🗂️ Project Structure
```
supermarket-project-2850/
├── .github/
│   └── workflows/
│       ├── backend.yml       ← backend CI pipeline
│       └── frontend.yml      ← frontend CI pipeline
├── Backend-SupermarketDatabase/
│   └── src/main/
│       ├── kotlin/com/supermarket/
│       │   ├── controller/   ← REST API controllers
│       │   ├── model/        ← JPA data classes
│       │   ├── repository/   ← database queries
│       │   └── SupermarketDatabaseApplication.kt
│       └── resources/
│           ├── application.properties
│           └── data.sql      ← seed data (82 products, 12 categories)
├── frontend/
│   ├── index.html            ← portal selection landing page
│   └── src/pages/
│       ├── customer/         ← customer portal pages
│       ├── warehouse/        ← warehouse portal pages
│       └── management/       ← management portal pages
├── start.sh                  ← starts both servers (codespace)
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose | Notes |
| --- | --- | --- |
| Kotlin + Spring Boot | Backend REST API | Switched from Ktor to Spring Boot for better JPA and database integration support |
| Spring Data JPA | ORM layer | Maps Kotlin data classes to H2 database tables |
| H2 (in-memory) | Database storage | File-based, serverless — seeded automatically from `data.sql` on startup, no separate installation required |
| HTML | Frontend markup | Core structure for all portal pages |
| CSS | Frontend styling | Custom styles with hand-written media queries layered on top of Bootstrap |
| Bootstrap 5 | UI component framework | Replaced Tailwind CSS following supervisor recommendation |
| JavaScript | Frontend interactivity | Handles dynamic rendering, basket management, form validation and API fetch calls |

---

## 📄 Frontend Pages

### Customer Portal
| Page | File | Description |
| --- | --- | --- |
| Portal Selection | `index.html` | Landing page with links to all three portals |
| Home | `customer/index.html` | Hero banner, category grid, sale/featured/trending product sections |
| Products | `customer/products.html` | Full product catalogue with sidebar filters, favourites, sort and search |
| Basket | `customer/basket.html` | Basket management, promo codes, VAT breakdown, free delivery tracker |
| Checkout | `customer/checkout.html` | Delivery address, delivery method, payment method, order summary |
| Orders | `customer/orders.html` | Order history with status filters, progress bar and order detail modal |
| Login | `customer/login.html` | Role-based login with demo accounts panel |
| Sign Up | `customer/signup.html` | Customer registration with live password strength indicator |

### Warehouse Portal
| Page | File | Description |
| --- | --- | --- |
| Home | `warehouse/index.html` | Warehouse portal dashboard |
| Picking List | `warehouse/pick.html` | Order picking interface sorted by shelf location |
| Inventory | `warehouse/inventory.html` | Stock level management and monitoring |
| Dispatch | `warehouse/dispatch.html` | Outgoing order dispatch and verification |
| Report | `warehouse/report.html` | Report substitutions and unavailable items |
| Scan | `warehouse/scan.html` | Barcode scanning for product lookup |
| Substitution | `warehouse/substitution.html` | Substitution selection for out of stock items |

### Management Portal
| Page | File | Description |
| --- | --- | --- |
| Home | `management/index.html` | Management dashboard with key metrics |
| Sales | `management/sales.html` | Sales metrics and trend charts |
| Products | `management/products.html` | Best-selling and trending product analysis |
| Export | `management/export.html` | Data export in CSV format |
| Customers | `management/customers.html` | Customer insights and behaviour analysis |

---

## 🗄️ Backend API Endpoints
| Method | Endpoint | Description | Status |
| --- | --- | --- | --- |
| GET | `/products` | Returns all active products | ✅ Live |
| GET | `/products/{id}` | Returns a single product by ID | ✅ Live |
| GET | `/categories` | Returns all product categories | ✅ Live |
| GET | `/customers` | Returns all customers | ✅ Live |
| GET | `/customers/{id}` | Returns a single customer by ID | ✅ Live |
| POST | `/customers` | Creates a new customer account | ✅ Live |
| GET | `/inventory` | Returns all stock levels | ✅ Live |
| GET | `/inventory/{productId}` | Returns stock level for a single product | ✅ Live |
| POST | `/inventory/seed` | Seeds all products with initial stock levels | ✅ Live |
| POST | `/auth/register` | Registers a new customer account | ✅ Live |
| POST | `/auth/login` | Authenticates a customer | ✅ Live |
| GET | `/orders` | Returns all orders | ✅ Live |
| POST | `/orders` | Places a new order and deducts inventory | ✅ Live |
| GET | `/orders/{id}` | Returns a single order by ID | ✅ Live |
| GET | `/cart/{customerId}` | Returns a customer's basket | ✅ Live |
| POST | `/cart` | Adds an item to a basket | ✅ Live |
| DELETE | `/cart/{customerId}/{productId}` | Removes an item from a basket | ✅ Live |
---

## 🚀 Setup & Installation

### Prerequisites

- [JDK 17](https://adoptium.net/) (Temurin recommended)
- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Firefox, Edge)

> No Node.js or database installation required — the frontend is plain HTML/CSS/JS, and H2 is in-memory and seeded automatically on startup.

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

The database is seeded automatically from `src/main/resources/data.sql` on first run — no manual setup required.

---

### 3. Running the Frontend

The frontend is plain HTML — no build step or npm install needed.

**Option A — Open directly in browser:**
Navigate to `frontend/index.html` and open it in your browser.

**Option B — Use VS Code Live Server (recommended):**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right click `frontend/index.html` → **Open with Live Server**
3. The app will open at `http://127.0.0.1:5500`

> Make sure the backend is running first so the frontend can fetch live product and category data.

---

### 4. Running in GitHub Codespaces

1. Open the repository on GitHub → click **Code** → **Codespaces** → open or create a codespace
2. Open a terminal (`Ctrl + `` `) and run:
```bash
cd /workspaces/supermarket-project-2850
./start.sh
```
3. In the **Ports** tab, right click the ports set both port **8080** and port **5500** to **Public**
4. Open the frontend using the forwarded port 5500 URL shown in the Ports tab
5. Paste /frontend/index.html at the end of the website of 5500 port

---

## 🔗 Portal URLs

### Local Development (VS Code Live Server)

| Portal | URL |
| --- | --- |
| Landing Page | `http://127.0.0.1:5500/frontend/index.html` |
| Customer Portal | `http://127.0.0.1:5500/frontend/src/pages/customer/index.html` |
| Warehouse Portal | `http://127.0.0.1:5500/frontend/src/pages/warehouse/index.html` |
| Management Portal | `http://127.0.0.1:5500/frontend/src/pages/management/index.html` |
| Backend API | `http://localhost:8080` |

### GitHub Codespaces

Replace `YOUR-CODESPACE-NAME` with the name shown in your Ports tab (e.g. `opulent-cod-7vv7p9q57v7pfrjjx`).

| Portal | URL |
| --- | --- |
| Landing Page | `https://YOUR-CODESPACE-NAME-5500.app.github.dev/frontend/index.html` |
| Customer Portal | `https://YOUR-CODESPACE-NAME-5500.app.github.dev/frontend/src/pages/customer/index.html` |
| Warehouse Portal | `https://YOUR-CODESPACE-NAME-5500.app.github.dev/frontend/src/pages/warehouse/index.html` |
| Management Portal | `https://YOUR-CODESPACE-NAME-5500.app.github.dev/frontend/src/pages/management/index.html` |
| Backend API | `https://YOUR-CODESPACE-NAME-8080.app.github.dev` |

---

### 5. Demo Accounts

Use these accounts to test all three portals without registering:

| User | Email | Password | Portal |
| --- | --- | --- | --- |
| Dave (Customer) | `dave@freshmart.com` | `customer123` | Customer Portal |
| Sarah (Warehouse) | `sarah@freshmart.com` | `warehouse123`| Warehouse Portal |
| Emma (Management) | `emma@freshmart.com` | `manager123` + `1234` (PIN)  | Management Portal |

These are also available as quick-fill buttons on the login page.

---

### 6. Running Backend Tests
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
