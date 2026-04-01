# Diadem Website with Admin Dashboard

A comprehensive trade website with a public-facing landing page and a secure admin dashboard for managing blogs, inquiries, and users.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend:** Node.js, Express.js, Multer (for file uploads)
- **Database:** MySQL
- **Auth:** JWT & Bcrypt

## Prerequisites
- Node.js (v18 or higher recommended)
- MySQL Server

## Installation & Setup

### 1. Database Setup
1.  Ensure your MySQL server is running.
2.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Configure environment variables:
    -   Create a `.env` file in the `server` directory (copy from `.env.example`).
    -   Update the database credentials if necessary:
        ```
        PORT=5000
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_password
        DB_NAME=diadem_db
        ```
5.  **Initialize the Database:**
    Run the setup script. This will create the database, tables, and seed the initial admin user.
    ```bash
    npm run setup
    ```

### 2. Backend Setup
1.  Ensure you are in the `server` directory.
2.  Start the server:
    ```bash
    npm start
    ```
    The server should run on `http://localhost:5000`.
    You should see a message: `✅ Database connected successfully.`

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

## Troubleshooting
-   **Server Error 500:** Check the terminal running the backend.
    -   If you see "Access denied", check your `.env` password.
    -   If you see "Unknown database", run `npm run setup` in the `server` folder.
-   **Uploads Failing:** Ensure the `server/uploads` directory exists (it should be created automatically).
-   **CORS Error:** Ensure both frontend and backend are running.
