import { useKeycloak } from "@react-keycloak/web";
import {Outlet, useLocation} from "react-router-dom";
import {useEffect} from "react";
import Loading from "../pages/Loading"

const ProtectedRoute = () => {
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();
    const isLoggedIn = keycloak?.authenticated;

    useEffect(() => {
        if (initialized && !isLoggedIn) {
            keycloak.login({ redirectUri: window.location.origin + location.pathname });
        }
    }, [initialized, isLoggedIn, keycloak, location]);

    if (!initialized) {
        return <Loading />;
    }

    return (
        isLoggedIn
            ? <Outlet />
            : <Loading />
    );
};

export default ProtectedRoute;