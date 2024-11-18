import './App.css';
import TaskPage from "./pages/TaskPage"
import UserInfo from "./pages/UserInfo"
import Reports from "./pages/Reports";
import {LicenseInfo} from '@mui/x-license';
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Layout from "./component/Layout";
import PrivateRoute from "./component/PrivateRoute";
import PublicTasks from "./pages/PublicTasks";
import ConnectedUsers from "./pages/ConnectedUsers";
import {Slide, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENCE_KEY);

function App() {
    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                transition={Slide}
                pauseOnHover
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        {/* public routes */}

                        <Route path="" element={<Home/>}/>

                        {/* Protected routes */}
                        <Route element={<PrivateRoute/>}>
                            <Route path="my-info" element={<UserInfo/>}/>
                            <Route path="connected-users" element={<ConnectedUsers/>}/>
                            <Route path="my-tasks" element={<TaskPage/>}/>
                            <Route path="reports" element={<Reports/>}/>
                            <Route path="public-tasks" element={<PublicTasks/>}/>
                        </Route>

                        {/* catch all */}
                        <Route path="*" element={<Page404/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
