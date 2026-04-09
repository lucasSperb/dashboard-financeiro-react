import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import Chart from "../../components/Chart";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

/* FORMATADOR */
const formatBRL = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function Dashboard() {
  const { transactions, add, remove, load, update } = useStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    load();
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  /* MÁSCARA */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (Number(value) / 100).toFixed(2);

    setAmount(
      Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const handleEditAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (Number(value) / 100).toFixed(2);

    setEditAmount(
      Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const parseBRL = (value: string) => {
    return Number(
      value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
    );
  };

  const handleAdd = () => {
    if (!title || !amount) {
      toast.error("Preencha todos os campos");
      return;
    }

    add({
      id: Math.random().toString(),
      title,
      amount: parseBRL(amount),
      type,
      date: new Date().toISOString(),
    });

    toast.success("Transação adicionada");

    setTitle("");
    setAmount("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditAmount(formatBRL(t.amount));
  };

  const saveEdit = (id: string) => {
    const original = transactions.find((t) => t.id === id);
    if (!original) return;

    update({
      ...original,
      title: editTitle,
      amount: parseBRL(editAmount),
    });

    toast.success("Atualizado");

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const total = transactions.reduce(
    (acc, t) => acc + (t.type === "income" ? t.amount : -t.amount),
    0
  );

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      {/* FORM */}
      <div className="form">
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Valor"
          value={amount}
          onChange={handleAmountChange}
        />

        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>

        <button onClick={handleAdd}>Adicionar</button>
      </div>

      {/* CARDS */}
      <div className="dashboard-grid">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Saldo</h3>
          <p>{formatBRL(total)}</p>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Entradas</h3>
          <p className="income">{formatBRL(income)}</p>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Saídas</h3>
          <p className="expense">{formatBRL(expense)}</p>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>Resumo</h3>
          <Chart />
        </motion.div>

        <div className="list-container">
          <h3>Transações</h3>

          {isLoading ? (
            <p className="empty">Carregando...</p>
          ) : transactions.length === 0 ? (
            <p className="empty">Nenhuma transação ainda</p>
          ) : (
            <ul className="list">
              <AnimatePresence>
                {transactions.map((t) => (
                  <motion.li
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    layout
                  >
                    {editingId === t.id ? (
                      <>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <input
                          value={editAmount}
                          onChange={handleEditAmount}
                        />

                        <div className="actions">
                          <button onClick={() => saveEdit(t.id)}>✔</button>
                          <button onClick={cancelEdit}>✕</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="info">
                          <span className="title">{t.title}</span>
                          <span className="date">
                            {new Date(t.date).toLocaleDateString()}
                          </span>
                        </div>

                        <span className={t.type}>
                          {formatBRL(t.amount)}
                        </span>

                        <div className="actions">
                          <button onClick={() => startEdit(t)}>✏️</button>
                          <button
                            className="delete"
                            onClick={() => {
                              remove(t.id);
                              toast("Removido", { icon: "🗑️" });
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}