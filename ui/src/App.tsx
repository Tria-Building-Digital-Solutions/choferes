import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import ManageEmployees from "./pages/ManageEmployees";
import AppBarComponent from "./components/AppBar/AppBarComponent";
import { APPBAR_MENU, ROUTES } from "./constants/constants";

const App: React.FC = () => {
  return (
    <Router>
      <AppBarComponent
        title={APPBAR_MENU.TITLE}
        links={[
          { label: APPBAR_MENU.ROLES, path: ROUTES.HOME },
          { label: APPBAR_MENU.EMPLOYEES, path: ROUTES.MANAGE_EMPLOYEES },
        ]}
      />
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-employees" element={<ManageEmployees />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
