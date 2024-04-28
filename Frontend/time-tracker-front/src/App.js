import './App.css';
import Login from "./component/Login";
import SignIn from "./component/Sign in";
import TaskPage from "./component/TaskPage"
import UserInfo from "./component/UserInfo"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

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
