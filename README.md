# COMP2850 Supermarket Web Application

A full-stack online supermarket web application. The system provides three 
distinct portals for customers, warehouse staff, and management/marketing teams.

### Action Workflows:
![Backend CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/backend.yml/badge.svg)
![Frontend CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/frontend.yml/badge.svg)

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

- **E-Commerce** — Customers can browse products, manage a shopping basket, 
  check out, schedule deliveries, and view order history.
- **Warehousing** — Warehouse staff access picking lists on mobile/tablet, 
  update stock levels, flag substitutions, and process incoming deliveries.
- **Management & Marketing** — Staff can view sales metrics, trending and 
  best-selling products, and export data — all filterable and searchable.

---

## Tech Stack
| Technology | Purpose |
|------------|---------|
| Kotlin + Ktor | Backend REST API | 
| React | Frontend UI framework | 
| TypeScript | Frontend type safety | 
| HTML | Frontend markup structure | 
| Tailwind CSS | Styling and UI components |
| Kotlin + JDBC | Backend database setting |

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- [JDK 17](https://adoptium.net/) (Temurin recommended)
- [Git](https://git-scm.com/)

> No database installation required — SQLite is file-based and bundled with the project.

---

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_ORG/supermarket-project-2850.git
cd supermarket-project-2850
```

### 2. Running the Backend
```bash
cd backend
./gradlew run
```
The API will be available at `http://localhost:8080`

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:3000`

### 4. Running Tests
```bash
# Backend
cd backend && ./gradlew test

# Frontend
cd frontend && npm test
```

## 🌿 Branching Strategy
- `main` — stable, protected branch. All changes go through PRs.
- `feature/team/your-feature-name` — for new features
- `fix/your-fix-name` — for bug fixes

All PRs must pass CI checks before merging.

---

## 📖 Documentation

Full documentation is available on the [GitHub Wiki](../../wiki), including:

- Personas & Job Stories
- Wireframes & UI Design
- Database & Class Diagrams
- Meeting Notes & Retrospectives
- Testing Strategy
