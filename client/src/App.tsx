import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AddDocument, Home, Landing, OneDocument, Otp, Profile, SecuritySetup } from "@/pages";
import { DocReminderRoutes } from "./routes/routes";
import { useAuth } from "./context";

const AppRoutes = () => {
  const { isLogged, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  return (
    <>
      {/* <GoogleOAuthProvider clientId={CLIENT_ID}>
      <PwaProvider> */}
      <AnimatePresence mode="wait">
        {isLogged && (
          <Routes location={location} key={location.pathname}>
            <Route path={DocReminderRoutes.home} element={<Home />} />
            <Route path={DocReminderRoutes.profile} element={<Profile />} />
            <Route path={DocReminderRoutes.addDocument} element={<AddDocument />} />
            <Route path={DocReminderRoutes.oneDocument} element={<OneDocument />} />
            <Route path="*" element={<Navigate to={DocReminderRoutes.home} replace />} />
          </Routes>
        )}
        {!isLogged && (
          <Routes location={location} key={location.pathname}>
            <Route path={DocReminderRoutes.landing} element={<Landing />} />
            <Route path={DocReminderRoutes.otp} element={<Otp />} />
            <Route path={DocReminderRoutes.security} element={<SecuritySetup />} />
            <Route path="*" element={<Navigate to={DocReminderRoutes.landing} replace />} />
          </Routes>
        )}
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
