import { axiosPrivate } from "./axios";
import { useEffect } from "react";
import {useKeycloak} from "@react-keycloak/web";
import {useLocation} from "react-router-dom";

const useAxiosPrivate = () => {
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${keycloak?.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response && error.response.status === 401 && initialized && !keycloak.authenticated) {
                    // Redirect to Keycloak login if 401 and not authenticated
                    await keycloak.login({
                        redirectUri: window.location.origin + location.pathname
                    });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [keycloak, initialized, location]);

    return axiosPrivate;
}

export default useAxiosPrivate;