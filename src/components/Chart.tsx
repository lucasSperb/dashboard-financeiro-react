import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../store/useStore";

const renderLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      fontSize={13}
      fontWeight={600}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        pointerEvents: "none",
        textShadow: "0 2px 6px rgba(0,0,0,0.8)",
      }}
    >
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

export default function Chart() {
  const { transactions } = useStore();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const data = [
    { name: "Entradas", value: income },
    { name: "Saídas", value: expense },
  ];

  const COLORS = ["#22c55e", "#f43f5e"];

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={50}
            label={renderLabel}
            labelLine={true}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => {
              if (typeof value === "number") {
                return value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              }
              return value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}