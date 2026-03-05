import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { Home, Landing, Otp, SecuritySetup } from "@/pages";
import { DocReminderRoutes } from "./routes/routes";

const AppRoutes = () => {
  const location = useLocation();
  return (
    <>
      {/* <GoogleOAuthProvider clientId={CLIENT_ID}>
      <PwaProvider> */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path={DocReminderRoutes.home} element={<Home />} />
          <Route path={DocReminderRoutes.landing} element={<Landing />} />
          <Route path={DocReminderRoutes.otp} element={<Otp />} />
          <Route path={DocReminderRoutes.security} element={<SecuritySetup />} />
        </Routes>
      </AnimatePresence>
      {/* </PwaProvider>
      </GoogleOAuthProvider> */}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
