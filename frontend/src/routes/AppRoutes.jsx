import { BrowserRouter, Routes, Route } from "react-router-dom";

import EventList from "../pages/EventList.jsx";
import EventDetails from "../pages/EventDetails.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import AdminCreateEvent from "../pages/AdminCreateEvent.jsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* AUTH */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* DASHBOARD (USER + ADMIN AREA) */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* USER ROUTES */}
                    <Route path="/" element={<EventList />} />
                    <Route path="/event/:id" element={<EventDetails />} />

                    {/* ADMIN ROUTES (NESTED FIX) */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminCreateEvent />
                            </AdminRoute>
                        }
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}