import type React from "react";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import LandingPage from "./ui/pages/LandingPage";
import Login from "./ui/pages/Login";
import Register from "./ui/pages/Register";
import Dashboard from "./ui/pages/Dashboard";
import Chat from "./ui/pages/Chat";
import Insights from "./ui/pages/Insights";
import Upload from "./ui/pages/Upload";
import Layout from "./ui/components/Layout";

import { AuthProvider } from "./core/context/AuthContext";
import ProtectedRoute from "./core/routes/protectedRoutes";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            }
                        />
                        <Route
                            path="/chat"
                            element={
                                <Layout>
                                    <Chat />
                                </Layout>
                            }
                        />

                        <Route
                            path="/upload"
                            element={
                                <Layout>
                                    <Upload />
                                </Layout>
                            }
                        />

                        <Route
                            path="/insights"
                            element={
                                <Layout>
                                    <Insights />
                                </Layout>
                            }
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
