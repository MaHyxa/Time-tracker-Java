import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import PageTemplate from "../component/PageTemplate"
import {useKeycloak} from "@react-keycloak/web";
import {jwtDecode} from "jwt-decode";
import StatsPage from "../component/StatsPage";

export default function UserInfo() {

    const {keycloak} = useKeycloak();
    const token = keycloak?.token;
    const decodedToken = jwtDecode(token);

    const changeUserDetails= async (e)=> {
        e.preventDefault();
        await keycloak.accountManagement();
    }


    if (!keycloak || !keycloak.authenticated) {
        return <div>Please login</div>;
    }

    return (
        <div>
            <PageTemplate>
                    <Typography variant="h3" gutterBottom>
                        Welcome, {decodedToken.name}.
                    </Typography>
                <StatsPage />
                <Button onClick={changeUserDetails}>Change user details</Button>
            </PageTemplate>
        </div>
    );
}