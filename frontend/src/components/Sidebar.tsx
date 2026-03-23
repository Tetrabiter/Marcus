import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquarePlus, History, Settings } from "lucide-react";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
        { path: "/setup", name: "New Interview", icon: MessageSquarePlus },
        { path: "/review", name: "History", icon: History },
    ];

    return (
        <aside className="w-64 bg-gray-950 border-r border-gray-800 hidden md:flex flex-col">
            <div className="p-6">
                <Link to="/" className="block mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        Marcus
                    </h1>
                </Link>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.includes(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-6">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;