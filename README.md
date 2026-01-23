# Diadem Website with Admin Dashboard

A comprehensive trade website with a public-facing landing page and a secure admin dashboard for managing blogs, inquiries, and users.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend:** Node.js, Express.js, Multer (for file uploads)
- **Database:** MySQL

## Prerequisites
- Node.js (v18 or higher recommended)
- MySQL Server

## Installation & Setup

### 1. Database Setup
1.  Ensure your MySQL server is running.
2.  Create the database and tables using the provided schema file:
    ```bash
    mysql -u root -p < server/schema.sql
    ```
    *(Or import `server/schema.sql` using a tool like MySQL Workbench or phpMyAdmin)*.
3.  This script creates:
    -   Database: `diadem_db`
    -   Tables: `users`, `articles`, `inquiries`
    -   Default Admin User: `admin` / `password`

### 2. Backend Setup
1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    -   Create a `.env` file in the `server` directory (copy from `.env.example`).
    -   Update the database credentials if necessary:
        ```
        PORT=5000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_password
        DB_NAME=diadem_db
        ```
4.  Start the server:
    ```bash
    npm start
    ```
    The server should run on `http://localhost:5000`.
    *Note: The `server/uploads` directory will be used to store uploaded PDFs.*

### 3. Frontend Setup
1.  Open a new terminal and navigate to the root directory (where `vite.config.js` is).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the link provided (usually `http://localhost:5173`) in your browser.

## Admin Access
-   Go to `/login` (e.g., `http://localhost:5173/login`).
-   Default Credentials:
    -   Username: `admin`
    -   Password: `password`

## Features
-   **Public Site:** Modern landing page with animations, services, and blog listing.
-   **Article Viewer:** Dedicated page for reading articles and viewing PDF attachments (embedded iframe).
-   **Admin Dashboard:**
    -   Overview statistics.
    -   **Blog Management:** Add, edit, and delete articles.
    -   **PDF Uploads:** Upload PDFs directly to the server to be served to users.
    -   **Inquiries:** View messages submitted via the contact form.
    -   **User Management:** Create and delete admin/client accounts.

## Troubleshooting
-   **"Network Error" / Data not loading:** Ensure the Backend server is running on port 5000 and the `.env` configuration matches your MySQL setup.
-   **Database Connection Failed:** Check your MySQL username/password in `server/.env`. Ensure the MySQL service is active.
-   **Image/PDF not loading:** Ensure the server URL in `src/context/DataContext.jsx` matches your backend URL.
