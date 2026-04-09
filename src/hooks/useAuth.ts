import { useState } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    setError("");

    if (!email.includes("@")) {
      setError("Email inválido");
      return false;
    }

    if (password.length < 4) {
      setError("Senha deve ter pelo menos 4 caracteres");
      return false;
    }

    setLoading(true);

    // simula request
    await new Promise((res) => setTimeout(res, 1200));

    localStorage.setItem("user", email);

    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
  };

  return { login, logout, loading, error };
}