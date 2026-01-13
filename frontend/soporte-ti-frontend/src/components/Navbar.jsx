import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h3>Soporte TI</h3>

      {user && (
        <div className="nav-links">
          <Link to="/tickets">Tickets</Link>
          <Link to="/tickets/new">Nuevo Ticket</Link>
          <span className="user">
            {user.name} ({user.role})
          </span>
          <button onClick={salir}>Salir</button>
        </div>
      )}
    </nav>
  );
}
