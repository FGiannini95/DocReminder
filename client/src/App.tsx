import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home, Landing } from "@/pages";
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
        </Routes>
      </BrowserRouter>
      {/* </PwaProvider>
      </GoogleOAuthProvider> */}
    </>
  );
}

export default App;
