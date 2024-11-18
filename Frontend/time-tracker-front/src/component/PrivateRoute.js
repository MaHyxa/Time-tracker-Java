import { useKeycloak } from "@react-keycloak/web";
import {Outlet, useLocation} from "react-router-dom";
import React, {useEffect} from "react";
import Loading from "../pages/Loading";
import WebSocketService from "../api/WebSocketService";
import {handleNotification} from "./notificationHandler";

const ProtectedRoute = () => {
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();
    const isLoggedIn = keycloak?.authenticated;

    useEffect(() => {
        if (initialized && isLoggedIn) {
            WebSocketService.connect(keycloak, (notification) => {
                handleNotification(notification);
            });

            return () => {
                WebSocketService.disconnect();
            };
        }
    }, [initialized, isLoggedIn, keycloak]);

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