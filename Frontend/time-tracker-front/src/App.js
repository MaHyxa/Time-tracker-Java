import './App.css';
import Login from "./component/Login";
import Sign_In from "./component/Sign in";
import Tasks from "./component/Tasks"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([{
    path: '/',
    element: <Login/>
},
    {
        path: '/register',
        element: <Sign_In/>
    },
    {
        path: '/my-tasks',
        element: <Tasks/>
    }])


function App() {
  return (
    <div>
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
