import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { StockProvider } from "./context/StockContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import SparePartsPage from "./pages/SparePartsPage";
import HistoryPage from "./pages/HistoryPage";
import DashboardPage from "./pages/DashboardPage";
import CarModelsPage from "./pages/CarModelsPage";
import AddCarModelPage from "./pages/AddCarModelPage";
import AddSparePartPage from "./pages/AddSparePartPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";


function App() {

  return (

    <StockProvider>

      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >


        <Routes>


          <Route element={<Layout />}>


            {/* PUBLIC */}

            <Route
              path="/"
              element={<HomePage />}
            />


            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />

            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />



            {/* PROTECTED */}

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/spare-parts/:carModelId"
              element={
                <ProtectedRoute>
                  <SparePartsPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/car-models"
              element={
                <ProtectedRoute>
                  <CarModelsPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/account-settings"
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              }
            />



            {/* STAFF + ADMIN */}

            <Route
              path="/add-car-model"
              element={
                <ProtectedRoute>
                  <AddCarModelPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/add-spare-part"
              element={
                <ProtectedRoute>
                  <AddSparePartPage />
                </ProtectedRoute>
              }
            />



            {/* ADMIN */}

            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />



            <Route
              path="*"
              element={<NotFoundPage />}
            />


          </Route>


        </Routes>


      </Router>


    </StockProvider>

  );
}


export default App;
