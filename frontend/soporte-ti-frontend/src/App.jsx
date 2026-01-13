import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <Tickets />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <PrivateRoute>
                <CreateTicket />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
