import { Outlet } from "react-router-dom"
import Header from "../pages/Header";
import Footer from "../pages/Footer";

const Layout = () => {
    return (
        <main className="App">
            <Header/>
            <Outlet />
            <Footer/>
        </main>
    )
}

export default Layout