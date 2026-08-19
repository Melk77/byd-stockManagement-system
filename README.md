# BYD Stock Management System

A simple stock management system for BYD spare parts built with a Node.js backend and a React + Vite frontend.

## Project Structure

- `Backend/` - Express server for backend API and data handling.
- `Frontend/` - React application built with Vite, including navigation and stock management pages.

## Requirements

- Node.js 18+ (recommended)
- npm

## Setup

### Backend

1. Open a terminal in `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

The backend listens on `http://localhost:3000`.

### Frontend

1. Open a terminal in `Frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on a Vite development URL, typically `http://localhost:5173`.

## Available Pages

- Home
- Products
- Spare Parts details
- History

## Notes

- The backend currently includes a basic Express server with a placeholder route at `/`.
- The frontend uses React Router for navigation and a context provider for stock state.
- Update the backend and frontend as needed to connect real APIs and data.
