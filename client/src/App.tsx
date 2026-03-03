import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home, Landing, Otp } from "@/pages";
import { DocReminderRoutes } from "./routes/routes";

function App() {
  return (
    <>
      {/* <GoogleOAuthProvider clientId={CLIENT_ID}>
        <PwaProvider> */}
      <BrowserRouter>
        <Routes>
          <Route path={DocReminderRoutes.home} element={<Home />} />
          <Route path={DocReminderRoutes.landing} element={<Landing />} />
          <Route path={DocReminderRoutes.otp} element={<Otp />} />
        </Routes>
      </BrowserRouter>
      {/* </PwaProvider>
      </GoogleOAuthProvider> */}
    </>
  );
}

export default App;
