import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/admin.css";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);

  const getTickets = async () => {
    const res = await api.get("/tickets");
    setTickets(res.data);
  };

  const changeStatus = async (id, status) => {
    await api.put(`/tickets/${id}/status`, { status });
    getTickets();
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard de Tickets</h2>

      <table className="tickets-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Asunto</th>
            <th>Usuario</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t, i) => (
            <tr key={t._id}>
              <td>{i + 1}</td>
              <td>{t.subject}</td>
              <td>{t.user?.name}</td>
              <td>
                <span className={`priority ${t.priority}`}>
                  {t.priority}
                </span>
              </td>
              <td>
                <span className={`status ${t.status}`}>
                  {t.status}
                </span>
              </td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  value={t.status}
                  onChange={(e) =>
                    changeStatus(t._id, e.target.value)
                  }
                >
                  <option value="open">Abierto</option>
                  <option value="in-progress">En proceso</option>
                  <option value="closed">Cerrado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
