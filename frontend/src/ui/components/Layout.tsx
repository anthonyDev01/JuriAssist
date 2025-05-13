import type React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex h-screen gradient-bg">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
                <div className="max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
