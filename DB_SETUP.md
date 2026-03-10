# Database Setup Guide (PostgreSQL)

This project uses PostgreSQL for data storage to ensure reliability and persistence.

## 1. Install PostgreSQL
If you don't have PostgreSQL installed:

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### MacOS (Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Windows
Download the installer from [postgresql.org](https://www.postgresql.org/download/windows/).

## 2. Create Database & User
Log in to the Postgres shell:

```bash
sudo -u postgres psql
```

Run the following commands (change 'password' to a secure password):

```sql
CREATE DATABASE diadem_db;
CREATE USER diadem_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE diadem_db TO diadem_user;
-- For Postgres 15+ you also need:
\c diadem_db
GRANT ALL ON SCHEMA public TO diadem_user;
```

Exit the shell:
```bash
\q
```

## 3. Configure Environment Variables
Update your `.env` file in the project root (or `server/.env` if running backend separately):

```bash
# Server Configuration
PORT=5000
SECRET_KEY=your_secret_key_here

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=diadem_user
DB_PASSWORD=secure_password
DB_NAME=diadem_db
DB_SSL=false
# Set DB_SSL=true if using a managed cloud database like DigitalOcean/Heroku
```

## 4. Run Setup Script
Initialize the database tables and seed initial data:

```bash
cd server
npm run setup
```

You should see: `✅ Setup Complete! You can now start the server.`

## 5. Troubleshooting
- **Connection Refused:** Check if Postgres is running (`sudo service postgresql status`) and if `DB_PORT` is correct.
- **Auth Failed:** Double check `DB_USER` and `DB_PASSWORD`.
- **SSL Error:** If connecting to a cloud provider (AWS/DigitalOcean), set `DB_SSL=true`.
