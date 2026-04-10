import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import {
  DocumentForm,
  Group,
  Home,
  Invitation,
  Landing,
  OneDocument,
  OneGroup,
  Otp,
  Profile,
  SecuritySetup,
} from "@/pages";
import { DocReminderRoutes } from "./routes/routes";
import { useAuth } from "./context";
import { PinSetup } from "./components";

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
            <Route path={DocReminderRoutes.addDocument} element={<DocumentForm />} />
            <Route path={DocReminderRoutes.editDocument} element={<DocumentForm />} />
            <Route path={DocReminderRoutes.oneDocument} element={<OneDocument />} />
            <Route path={DocReminderRoutes.pinSetup} element={<PinSetup mode="create" />} />
            <Route path={DocReminderRoutes.group} element={<Group />} />
            <Route path={DocReminderRoutes.oneGroup} element={<OneGroup />} />
            <Route path={DocReminderRoutes.invitation} element={<Invitation />} />
            <Route path="*" element={<Navigate to={DocReminderRoutes.home} replace />} />
          </Routes>
        )}
        {!isLogged && (
          <Routes location={location} key={location.pathname}>
            <Route path={DocReminderRoutes.landing} element={<Landing />} />
            <Route path={DocReminderRoutes.otp} element={<Otp />} />
            <Route path={DocReminderRoutes.security} element={<SecuritySetup />} />
            <Route path={DocReminderRoutes.pinLogin} element={<PinSetup mode="verify" />} />
            <Route path={DocReminderRoutes.invitation} element={<Invitation />} />
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
