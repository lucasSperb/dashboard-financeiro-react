import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bem-vindo</h1>
        <p>Acesse sua conta</p>

        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Senha</label>

          <span className="toggle" onClick={() => setShow(!show)}>
            {show ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        {error && <span className="error">{error}</span>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}