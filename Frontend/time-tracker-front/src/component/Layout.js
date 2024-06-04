import {Outlet} from "react-router-dom"
import Footer from "./Footer";
import Navbar from "../pages/Navbar";
import {OpenProvider} from "./useOpen";

const Layout = () => {
    return (
        <OpenProvider>
            <main className="App">
                <Navbar/>
                <Outlet/>
                <Footer/>
            </main>
        </OpenProvider>
    )
}

export default Layout