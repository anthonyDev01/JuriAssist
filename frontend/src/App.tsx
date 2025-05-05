import { ToastContainer } from "react-toastify";
import "./App.css";
import Login from "./ui/pages/login";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./core/context/authContext";

function App() {
    return (
        <>
            <ToastContainer position="top-right" autoClose={1800} />

            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </>
    );
}

export default App;
