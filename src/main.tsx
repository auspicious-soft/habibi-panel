import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
<ToastContainer
  position="top-center"
  autoClose={2000}       
  hideProgressBar={false} 
  closeOnClick={true}    
  draggable={false}    
  theme="dark"         
  newestOnTop={false}    
/>
    <App />
  </StrictMode>
);
