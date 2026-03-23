import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-900 text-white w-full overflow-hidden">
            <Sidebar />
            <main className="flex-1 w-full h-full overflow-y-auto relative">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
