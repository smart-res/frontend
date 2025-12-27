import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Tables from "../pages/admin/Table";
import Login from "../pages/admin/Login";
import MenuCategories from "../pages/admin/MenuCategories";
import ProtectedRoute from "./ProtectedRoute";
import MenuItems from "../pages/admin/MenuItems";
import CustomerMenuPage from "../pages/customer/CustomerMenuPage";
import CustomerLayout from "../layouts/CustomerLayout";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/customer/menu" element={<CustomerMenuPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/menu/categories" element={<MenuCategories />} />
        <Route path="/menu/items" element={<MenuItems />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
