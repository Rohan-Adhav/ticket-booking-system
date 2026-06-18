import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function DashboardLayout(){
    return(
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    );
}