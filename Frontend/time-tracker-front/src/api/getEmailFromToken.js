import { jwtDecode } from 'jwt-decode';
import {useKeycloak} from "@react-keycloak/web";

const getEmailFromToken = () => {

    const { keycloak } = useKeycloak();

    if (!keycloak?.token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(keycloak?.token);
        return decodedToken.email || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export default getEmailFromToken;
