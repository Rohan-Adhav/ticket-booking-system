import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth.js";

export default function AdminRoute({ children }) {
    const role = getRole();

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}