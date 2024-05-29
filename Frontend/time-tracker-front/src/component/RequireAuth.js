import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../api/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.isAuthenticated
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;