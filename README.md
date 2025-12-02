# 📁 Lightweight File Manager Backend Prototype (🚧 Work In Progress !!!! 🚧 )

## A lightweight backend prototype built using **Node.js**, **Express.js**, **MySQL**, and **Multer** that allows users to **upload, view, download, and delete files** stored locally on the server. Designed for backend learning and project portfolio enhancement — **no authentication required in this initial version**.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/Status-WIP-orange.svg)]()

This document outlines the project's current status, simple architecture, and future development goals. **We are now focusing on security and feature expansion, and we actively seek community contributions!**

---

## 🚀 Get Started Immediately (1-Click Contribution)

We aim to make contributing as painless as possible. Use GitHub Codespaces or VS Code Dev Containers for an instant, pre-configured development environment.

### 🛠️ Prerequisites

* A GitHub account (for Codespaces)
* OR Docker installed (for local devcontainers)

### ✨ The Easy Way (Recommended)

1.  Click the **"Open in Codespaces"** button on GitHub.
2.  Wait for the container to build (it sets up Node and MySQL).
3.  The project is ready! Start coding.

### 💻 Local Setup (Manual Way)

1.  Clone the repository: `git clone your-repo-url`
2.  Start the entire stack (Backend, MySQL, Redis): **(WIP)** `docker compose up -d`
3.  Install dependencies: `npm install`
4.  Run the application: `npm start`

---

## 1. Current Progress (Completed Features) ✅

The core **File CRUD** (Create, Read, Update, Delete) functionality is operational:

| Endpoint | Method | Description | Technologies Used |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | **Health Check**: Basic API status confirmation. | Express |
| `/upload` | `POST` | **File Upload**: Saves the file to the local disk (`/uploads`) and stores metadata (name, size, type) in MySQL. | Multer |
| `/files` | `GET` | **File Listing**: Retrieves a list of all file metadata. | MySQL |
| `/files/:id` | `GET` | **Metadata**: Retrieves detailed information about a single file. | MySQL |
| `/files/:id/download` | `GET` | **File Download**: Serves the physical file from disk using the stored path. | `fs` module |
| `/files/:id` | `DELETE`| **File Deletion**: Removes metadata from DB and deletes the file from disk. | MySQL, `fs` module |

---

## 2. Technology Stack 💻

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Server** | **Node.js** | Simple, fast, and asynchronous execution environment. |
| **Framework** | **Express.js** | Minimalist and flexible web application framework for simple routing. |
| **File Handling**| **Multer** | Middleware for handling `multipart/form-data` (file uploads). |
| **Database** | **MySQL** | Reliable relational database for storing file metadata. |
| **Caching (Planned)**| **Redis** | Lightweight in-memory data store for caching and session management. |

---

## 🤝 How to Contribute (New Features Needed!) 🚀

We need help moving beyond this basic prototype by implementing essential security and quality-of-life features. Pick a feature below and open a Pull Request.

---

## 📝 Pending Tasks & Feature Development (High Priority)

### 🔑 Security & Authentication

* **[ ] User Registration & Login:** Implement routes and logic for creating user accounts and logging in. **(Requires DB schema update for `users` table.)** (Issue: #101 - `good first issue`)
* **[ ] JWT Implementation:** Add middleware to secure all file-related routes (`/upload`, `/files`, etc.) requiring a valid JWT in the header. (Issue: #102)
* **[ ] Ownership Enforcement:** Modify all routes (`/files/:id`) to ensure a user can only access or delete files they uploaded. (Issue: #103)

### 📈 File Management Enrichment

* **[ ] File Search & Filtering:** Implement query parameters on `GET /files` (e.g., `/files?type=image&name=report`) to filter files by type, size, or name pattern. (Issue: #201)
* **[ ] File Renaming:** Add a `PUT /files/:id/rename` route to update the `original_name` in the database. (Issue: #202 - `good first issue`)
* **[ ] Paging/Pagination:** Implement offset and limit query parameters on `GET /files` to handle large file lists efficiently. (Issue: #203)
* **[ ] File Type Validation:** Add checks to the `/upload` route to restrict file types (e.g., block executables) for security. (Issue: #204)

<!-- ### ⚡ Performance & Tooling

* **[ ] Redis Integration:** Set up the connection to Redis and use it to store and validate refresh tokens. (Issue: #301)
* **[ ] Docker Configuration:** Finalize the `docker-compose.yml` to correctly link Node.js, MySQL, and Redis services. (Issue: #302)
* **[ ] Logging Middleware:** Implement basic logging for all incoming requests (URL, IP, timestamp). (Issue: #303 - `good first issue`) -->