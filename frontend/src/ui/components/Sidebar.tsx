"use client";

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
    FileUp,
    BarChart2,
    LogOut,
    Home,
    MessageSquare,
    User,
    Scale,
    Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import useAuth from "../../core/hooks/useAuth";
import { api, getAuthorization } from "../../core/service/api";

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<any>();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);

            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const fetchUser = () => {
            api.get("/user", getAuthorization())
                .then((response) => {
                    setUser(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        fetchUser();
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            {isCollapsed && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 md:hidden bg-purple-600 text-white p-2 rounded-lg shadow-lg"
                >
                    <Menu size={24} />
                </button>
            )}

            <div
                className={`${
                    isCollapsed ? "w-0 md:w-16" : "w-64"
                } h-full sidebar-gradient flex flex-col text-white fixed md:relative z-40 transition-all duration-300 ease-in-out overflow-hidden`}
            >
                <div
                    className={`p-6 flex items-center ${
                        isCollapsed ? "md:justify-center" : "space-x-3"
                    } cursor-pointer whitespace-nowrap`}
                    onClick={toggleSidebar}
                >
                    <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h1
                        className={`text-2xl font-bold transition-opacity duration-300 ${
                            isCollapsed ? "md:hidden" : "opacity-100"
                        }`}
                    >
                        JuriAssist
                    </h1>
                </div>

                <div className={`px-4 py-2 ${isCollapsed ? "md:hidden" : ""}`}>
                    <div className="bg-white/10 rounded-lg p-3 flex items-center space-x-3 whitespace-nowrap">
                        <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                                {user?.name}
                            </p>
                            <p
                                className="text-xs text-gray-400 truncate"
                                title={user?.email}
                            >
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? "" : "")}
                    >
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={`w-full justify-start whitespace-nowrap ${
                                    isCollapsed
                                        ? "md:justify-center md:px-2"
                                        : ""
                                }`}
                            >
                                <Home
                                    className={`h-4 w-4 ${
                                        isCollapsed ? "md:mr-0" : "mr-2"
                                    }`}
                                />
                                <span
                                    className={`transition-opacity duration-300 ${
                                        isCollapsed ? "md:hidden" : "inline"
                                    }`}
                                >
                                    Dashboard
                                </span>
                            </Button>
                        )}
                    </NavLink>

                    <NavLink
                        to="/chat"
                        className={({ isActive }) => (isActive ? "" : "")}
                    >
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={`w-full justify-start whitespace-nowrap ${
                                    isCollapsed
                                        ? "md:justify-center md:px-2"
                                        : ""
                                }`}
                            >
                                <MessageSquare
                                    className={`h-4 w-4 ${
                                        isCollapsed ? "md:mr-0" : "mr-2"
                                    }`}
                                />
                                <span
                                    className={`transition-opacity duration-300 ${
                                        isCollapsed ? "md:hidden" : "inline"
                                    }`}
                                >
                                    Chat
                                </span>
                            </Button>
                        )}
                    </NavLink>

                    <NavLink
                        to="/upload"
                        className={({ isActive }) => (isActive ? "" : "")}
                    >
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={`w-full justify-start whitespace-nowrap ${
                                    isCollapsed
                                        ? "md:justify-center md:px-2"
                                        : ""
                                }`}
                            >
                                <FileUp
                                    className={`h-4 w-4 ${
                                        isCollapsed ? "md:mr-0" : "mr-2"
                                    }`}
                                />
                                <span
                                    className={`transition-opacity duration-300 ${
                                        isCollapsed ? "md:hidden" : "inline"
                                    }`}
                                >
                                    Upload
                                </span>
                            </Button>
                        )}
                    </NavLink>

                    <NavLink
                        to="/insights"
                        className={({ isActive }) => (isActive ? "" : "")}
                    >
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={`w-full justify-start whitespace-nowrap ${
                                    isCollapsed
                                        ? "md:justify-center md:px-2"
                                        : ""
                                }`}
                            >
                                <BarChart2
                                    className={`h-4 w-4 ${
                                        isCollapsed ? "md:mr-0" : "mr-2"
                                    }`}
                                />
                                <span
                                    className={`transition-opacity duration-300 ${
                                        isCollapsed ? "md:hidden" : "inline"
                                    }`}
                                >
                                    Insights
                                </span>
                            </Button>
                        )}
                    </NavLink>
                </nav>

                <div className="p-4 mt-auto">
                    <Button
                        variant="outline"
                        className={`w-full whitespace-nowrap ${
                            isCollapsed ? "md:justify-center md:px-2" : ""
                        }`}
                        onClick={handleLogout}
                    >
                        <LogOut
                            className={`h-4 w-4 ${
                                isCollapsed ? "md:mr-0" : "mr-2"
                            }`}
                        />
                        <span
                            className={`transition-opacity duration-300 ${
                                isCollapsed ? "md:hidden" : "inline"
                            }`}
                        >
                            Sair
                        </span>
                    </Button>
                </div>
            </div>

            {!isCollapsed && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default Sidebar;
