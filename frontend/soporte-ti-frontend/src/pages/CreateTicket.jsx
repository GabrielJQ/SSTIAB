import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/tickets", { title, description });
    navigate("/tickets");
  };

  return (
    <form onSubmit={submit}>
      <h2>Nuevo Ticket</h2>
      <input onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />
      <button>Crear</button>
    </form>
  );
}
