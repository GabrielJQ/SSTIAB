import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get("/tickets").then((res) => setTickets(res.data));
  }, []);

  return (
    <div>
      <h2>Mis Tickets</h2>
      {tickets.map((t) => (
        <div key={t._id}>
          <h4>{t.title}</h4>
          <p>{t.status}</p>
        </div>
      ))}
    </div>
  );
}
