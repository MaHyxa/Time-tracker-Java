import { axiosPrivate } from "./axios";
import { useEffect } from "react";
import {useKeycloak} from "@react-keycloak/web";

const useAxiosPrivate = () => {
    const { keycloak } = useKeycloak();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${keycloak?.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    }, [keycloak])

    return axiosPrivate;
}

export default useAxiosPrivate;