import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

 const login = async (email, password) => {
  console.log("Intentando login...");
  const res = await api.post("/auth/login", { email, password });
  console.log("Respuesta login 👉", res.data);

  localStorage.setItem("token", res.data.token);
  setUser(res.data.user);

  console.log("Usuario seteado 👉", res.data.user);
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
