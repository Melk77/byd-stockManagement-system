# BYD Stock Management System

A full-stack stock management system for managing BYD spare parts, inventory, product information, stock movements, and history.

The system is built with a **React + Vite frontend**, **Node.js + Express backend**, and **MySQL database**.

## 🚀 Features

- 📦 Spare parts management
- 📊 Inventory and stock management
- 🔍 Search and view spare parts
- 📝 Stock movement and history tracking
- 🏠 Dashboard/Home page
- 🔧 Spare part details
- 🗃️ MySQL database integration
- 🔄 RESTful API
- ⚡ Fast development with Vite
- 📱 Responsive user interface

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST API

### Database

- MySQL
- mysql2

### Development Tools

- Git
- GitHub
- npm
- VS Code
- Postman

## 📁 Project Structure

byd-stockManagement-system/
│
├── Backend/
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ ├── models/
│ ├── middleware/
│ ├── config/
│ ├── app.js
│ ├── server.js
│ └── package.json
│
├── Frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── services/
│ │ └── App.jsx
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
├── database/
│ ├── schema.sql
│ └── seed.sql
│
├── .gitignore
└── README.md

> The exact folder structure may change as the project continues to develop.

## ⚙️ Requirements

Before running the project, make sure you have installed:

- Node.js 18 or higher
- npm
- MySQL 8+
- Git

Check your installed versions:

    node --version
    npm --version
    mysql --version
    git --version

## 🗃️ Database Setup

This project uses **MySQL** as its database.

### 1. Create the Database

Open MySQL and create the database:

    CREATE DATABASE byd_stock_management;

Select the database:

    USE byd_stock_management;

### 2. Create Database Tables

Run the SQL schema file:

    SOURCE database/schema.sql;

### 3. Insert Sample Data

If the project contains sample/seed data:

    SOURCE database/seed.sql;

The database will then be ready for the backend application.

## 🔐 Backend Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

    PORT=3000

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=byd_stock_management
    DB_PORT=3306

    JWT_SECRET=your_secret_key

Replace the values with your local MySQL configuration.

> Never commit your `.env` file to GitHub.

## 🔧 Installation

### 1. Clone the Repository

    git clone https://github.com/Melk77/byd-stockManagement-system.git

Navigate to the project:

    cd byd-stockManagement-system

### 2. Set Up the Database

Create the MySQL database:

    CREATE DATABASE byd_stock_management;

Then run:

    SOURCE database/schema.sql;

If seed data is available:

    SOURCE database/seed.sql;

### 3. Set Up the Backend

Navigate to the Backend directory:

    cd Backend

Install dependencies:

    npm install

Create the `.env` file and configure your MySQL database.

Start the backend:

    npm start

The backend will normally run at:

    http://localhost:3000

### 4. Set Up the Frontend

Open another terminal and navigate to the Frontend directory:

    cd Frontend

Install dependencies:

    npm install

Start the development server:

    npm run dev

Vite will normally provide a URL similar to:

    http://localhost:5173

Open the URL in your browser.

## 🖥️ Application Pages

### 🏠 Home

Provides an overview and entry point to the stock management system.

### 📦 Products

Allows users to view and manage available BYD spare parts.

### 🔧 Spare Part Details

Displays detailed information about individual spare parts.

### 📊 Inventory

Displays current stock quantities and inventory information.

### 📜 History

Displays previous stock activities and stock movements.

## 🔌 Backend API

The backend provides RESTful API endpoints that allow the frontend to communicate with the server.

Example:

    GET /

Possible API endpoints include:

    /api/products
    /api/spare-parts
    /api/inventory
    /api/history

Update this section as additional API endpoints are implemented.

## 🔄 Application Architecture

    ┌─────────────────────────┐
    │     React Frontend      │
    │        + Vite           │
    └────────────┬────────────┘
                 │
                 │ HTTP / REST API
                 ▼
    ┌─────────────────────────┐
    │    Node.js + Express    │
    │        Backend          │
    └────────────┬────────────┘
                 │
                 │ SQL Queries
                 ▼
    ┌─────────────────────────┐
    │      MySQL Database     │
    │  byd_stock_management   │
    └─────────────────────────┘

## 📦 Database Structure

The database is designed to manage the main entities of the stock management system.

Possible tables include:

- `products` - Stores BYD spare-part information
- `inventory` - Stores current stock quantities
- `stock_movements` - Tracks stock-in and stock-out operations
- `users` - Stores system users
- `categories` - Stores spare-part categories
- `suppliers` - Stores supplier information

The database structure may be expanded as the project develops.

## 🌱 Development

During development, run the backend and frontend separately.

### Backend

    cd Backend
    npm install
    npm start

### Frontend

    cd Frontend
    npm install
    npm run dev

## 🧪 Testing

Before pushing changes to GitHub, make sure both the frontend and backend are working correctly.

### Backend

    cd Backend
    npm start

### Frontend

    cd Frontend
    npm run dev

API endpoints can be tested using **Postman**.

The frontend can be tested through the browser.

## 🔐 Security

The project uses environment variables for sensitive configuration.

Do not commit:

    .env

Do not expose:

- Database passwords
- JWT secrets
- API keys
- Production credentials

The `.gitignore` should include:

    node_modules/
    .env
    .env.local
    dist/
    build/

## 🤝 Contributing

If you are working with a team, create a separate branch for your feature.

### Create a feature branch

    git checkout -b feature/your-feature

### Add your changes

    git add .

### Commit your changes

    git commit -m "Add your feature"

### Push your branch

    git push origin feature/your-feature

Then create a Pull Request on GitHub.

## 📌 Project Status

The project is currently under active development.

### Completed

- React + Vite frontend setup
- Node.js + Express backend setup
- MySQL database integration
- Frontend navigation
- Stock management interface
- Spare part pages
- Basic backend API structure

### Planned

- [ ] User authentication
- [ ] Role-based access control
- [ ] Complete CRUD operations
- [ ] Inventory management
- [ ] Stock-in and stock-out tracking
- [ ] Supplier management
- [ ] Advanced search and filtering
- [ ] Reports and analytics
- [ ] Low-stock notifications
- [ ] Production deployment

## 👨‍💻 Author

**Melkamu Tsegaye**

GitHub: https://github.com/Melk77

Computer Science Student & Full-Stack Developer

## 📄 License

This project is currently intended for educational and development purposes.
