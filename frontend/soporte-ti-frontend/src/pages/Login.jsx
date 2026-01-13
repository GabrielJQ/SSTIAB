import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
const submit = async (e) => {
  e.preventDefault();
  console.log("Submit login");

  try {
    await login(email, password);
    console.log("Login terminó OK");
    navigate("/tickets");
  } catch (err) {
    console.error("ERROR EN LOGIN 👉", err);
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/tickets");
  };

  return (
    <div className="login-container">
      <form onSubmit={submit} className="login-box">
        <h2>Soporte TI</h2>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button>Entrar</button>
      </form>
    </div>
  );
}

