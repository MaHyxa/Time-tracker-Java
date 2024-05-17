import './App.css';
import Login from "./component/Login";
import SignIn from "./component/Sign in";
import TaskPage from "./component/TaskPage"
import UserInfo from "./component/UserInfo"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Reports from "./component/Reports";
import StatsPage from "./component/StatsPage";
import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENCE_KEY);

const router = createBrowserRouter([{
    path: '/',
    element: <Login/>
},
    {
        path: '/register',
        element: <SignIn/>
    },
    {
        path: '/my-info',
        element: <UserInfo/>
    },
    {
        path: '/reports',
        element: <Reports/>
    },
    {
        path: '/my-stats',
        element: <StatsPage />
    },
    {
        path: '/my-tasks',
        element: <TaskPage/>
    }])


function App() {
  return (
    <div>
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
