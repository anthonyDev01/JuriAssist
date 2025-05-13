import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "./ui/components/ui/toaster";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <App />
            <Toaster />
        </SkeletonTheme>
    </StrictMode>
);
