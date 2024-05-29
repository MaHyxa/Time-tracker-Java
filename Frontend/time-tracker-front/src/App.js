import './App.css';
import TaskPage from "./component/TaskPage"
import UserInfo from "./component/UserInfo"
import Reports from "./component/Reports";
import StatsPage from "./component/StatsPage";
import { LicenseInfo } from '@mui/x-license';
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Page404 from "./pages/Page404";
import { Routes, Route } from 'react-router-dom';
import Layout from "./component/Layout";
import RequireAuth from "./component/RequireAuth";
import AccessDenied from "./pages/AccessDenied";

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENCE_KEY);

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}

                <Route path="/" element={<Home />} />
                <Route path="access-denied" element={<AccessDenied />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<SignUp />} />

                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="my-info" element={<UserInfo />} />
                    <Route path="my-tasks" element={<TaskPage />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="my-stats" element={<StatsPage />} />
                </Route>

                {/* catch all */}
                <Route path="*" element={<Page404 />} />
            </Route>
        </Routes>
    );
}

export default App;
