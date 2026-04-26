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

## 📁 Project Structure

```
supermarket-project-2850/
├── .github/
│   └── workflows/
│       ├── backend.yml                  ← Kotlin Spring Boot CI pipeline
│       └── frontend.yml                 ← HTML/CSS/JS CI pipeline
├── Backend-SupermarketDatabase/
│   ├── .gitignore                       ← Excludes build/ and .gradle/ from git
│   └── src/main/
│       ├── kotlin/com/supermarket/
│       │   ├── CorsConfig.kt            ← CORS config allowing frontend access
│       │   ├── SupermarketDatabaseApplication.kt
│       │   ├── controller/
│       │   │   ├── ProductController.kt
│       │   │   ├── CategoryController.kt
│       │   │   ├── CustomerController.kt
│       │   │   └── InventoryController.kt
│       │   ├── model/
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
│       │   └── repository/
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
│       │   └── styles.css               ← Landing page styles
│       ├── js/
│       │   └── portal.js                ← Landing page ripple effect
│       └── pages/
│           ├── customer/
│           │   ├── index.html           ← Customer portal home
│           │   ├── products.html        ← Product catalogue with filters & favourites
│           │   ├── basket.html          ← Basket with promo codes & VAT
│           │   ├── checkout.html        ← Checkout with delivery & payment
│           │   ├── orders.html          ← Order history & tracking
│           │   ├── login.html           ← Login with role-based redirect
│           │   └── signup.html          ← Customer registration
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
├── start.sh                             ← Runs both servers simultaneously (codespace)
└── README.md
```

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
### Management Portal 🔄 In Progress

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

## 🚀 Setup & Installation

### Prerequisites

- [JDK 17](https://adoptium.net/) (Temurin recommended)
- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Firefox, Edge)

> No Node.js or database installation required — the frontend is plain HTML/CSS/JS, and the database is seeded automatically on startup.

---

### Option A — Running Locally (VS Code)

**1. Clone the repository**
```bash
git clone https://github.com/ekunwill25/supermarket-project-2850.git
cd supermarket-project-2850
```

**2. Start the backend**
```bash
cd Backend-SupermarketDatabase

# macOS / Linux
./gradlew bootRun

# Windows
.\gradlew.bat bootRun
```
The API will be available at `http://localhost:8080`. The database seeds automatically from `data.sql` — no manual setup needed.

**3. Start the frontend**

Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code, then right click `frontend/index.html` → **Open with Live Server**.

The app will open at `http://127.0.0.1:5500/frontend/index.html`

**4. Run backend tests**
```bash
# macOS / Linux
./gradlew test

# Windows
.\gradlew.bat test
```

---

### Option B — Running in GitHub Codespaces

**1. Open the codespace**

Go to the [repository](https://github.com/ekunwill25/supermarket-project-2850) → click **Code** → **Codespaces** → open or create a codespace.

**2. Open a terminal** (`Ctrl + `` `) and run the start script:
```bash
cd /workspaces/supermarket-project-2850
./start.sh
```
This starts both the backend (port 8080) and frontend server (port 5500) simultaneously. Wait ~30 seconds for the backend to fully start — you'll see `85% EXECUTING` when it's ready.

**3. Set both ports to Public**

In the **Ports** tab at the bottom of VS Code:
- Right click port **8080** → Port Visibility → **Public**
- Right click port **5500** → Port Visibility → **Public**

**4. Update the API URL**

The frontend needs to point to the codespace backend URL instead of localhost. Run this once (replace the codespace name with yours from the Ports tab):
```bash
find /workspaces/supermarket-project-2850/frontend -name "*.html" -exec sed -i \
  "s|http://localhost:8080|https://YOUR-CODESPACE-NAME-8080.app.github.dev|g" {} \;
```

**5. Open the frontend**
```
https://YOUR-CODESPACE-NAME-5500.app.github.dev/frontend/index.html
```

> ⚠️ The codespace URL changes every time a new codespace is created. If products stop loading, re-run step 4 with the new codespace name from the Ports tab.

---

### Demo Accounts

| User | Email | Password | Portal |
|------|-------|----------|--------|
| Dave (Customer) | `dave@freshmart.com` | `customer123` | Customer Portal |
| Sarah (Warehouse) | `sarah@freshmart.com` | `warehouse123` | Warehouse Portal |
| Emma (Management) | `emma@freshmart.com` | `manager123` | Management Portal |

These are also available as quick-fill buttons on the login page.

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
