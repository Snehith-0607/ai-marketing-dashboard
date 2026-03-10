import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#465FFF", "#FF6B35", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

interface DashboardPreviewProps {
  chartType?: string;
  chartData?: any[];
  chartTitle?: string;
  insight?: string;
  compact?: boolean;
}

export default function DashboardPreview({
  chartType = "bar",
  chartData = [],
  chartTitle = "Analysis Result",
  insight = "",
  compact = false,
}: DashboardPreviewProps) {
  const [backendData, setBackendData] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch real data from backend as fallback
  useEffect(() => {
    if (!chartData || chartData.length === 0) {
      fetch("http://localhost:8000/analysis?t=" + Date.now())
        .then((r) => r.json())
        .then((data) => {
          const firstAvailableChart =
            data?.charts?.revenue_by_campaign ||
            data?.charts?.roi_by_channel ||
            data?.charts?.impressions_by_channel ||
            data?.charts?.engagement_by_segment ||
            [];
          setBackendData(firstAvailableChart);
        })
        .catch(() => {
          setBackendData([]);
        });
    }
  }, [chartData]);

  const rawData = chartData && chartData.length > 0 ? chartData : backendData;

  const normalizedData = rawData
    .map((item) => ({
      name: String(
        item.name ??
          item.category ??
          item.month ??
          Object.values(item)[0] ??
          "?"
      ),
      value: Number(
        item.value ??
          item.revenue ??
          item.total ??
          Object.values(item)[1] ??
          0
      ),
    }))
    .filter((item) => item.name && item.value > 0);

  const formatValue = (v: any) => {
    if (typeof v === "number" && v > 10000000)
      return "₹" + (v / 10000000).toFixed(1) + "Cr";
    if (typeof v === "number" && v > 100000)
      return (v / 100000).toFixed(1) + "L";
    if (typeof v === "number" && v > 1000)
      return (v / 1000).toFixed(1) + "K";
    return v;
  };

  const getConfidence = (data: any[]) => {
    if (!data || data.length === 0) {
      return { score: 0, label: "No Data", color: "#ef4444" };
    }
    const values = data.map((d) => d.value || 0);
    const avg =
      values.reduce((a, b) => a + b, 0) / (values.length || 1);
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) /
      (values.length || 1);
    const stdDev = Math.sqrt(variance);
    const coeffVariation = avg > 0 ? stdDev / avg : 0;

    let score = 0;
    if (data.length >= 5) score += 40;
    else if (data.length >= 3) score += 25;
    else score += 10;

    if (coeffVariation > 0.3) score += 40;
    else if (coeffVariation > 0.1) score += 25;
    else score += 10;

    score += Math.min(data.length * 4, 20);
    score = Math.min(score, 98);

    if (score >= 75)
      return { score, label: "High Confidence", color: "#10b981" };
    if (score >= 50)
      return { score, label: "Medium Confidence", color: "#f59e0b" };
    return { score, label: "Low Confidence", color: "#ef4444" };
  };

  if (normalizedData.length === 0) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          padding: "16px",
          marginTop: "8px",
          width: "100%",
          maxWidth: "520px",
          textAlign: "center",
          color: "#94A3B8",
          fontSize: "13px",
        }}
      >
        <p>⏳ Loading chart data...</p>
        <p style={{ fontSize: "11px", marginTop: "4px" }}>
          Make sure backend is running at localhost:8000
        </p>
      </div>
    );
  }

  const downloadChart = async () => {
    if (!chartRef.current) return;
    const anyWin = window as any;
    if (!anyWin.html2canvas) {
      console.warn("html2canvas not available on window");
      return;
    }
    const canvas = await anyWin.html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = `${chartTitle || "chart"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={compact ? 160 : 200}>
          <LineChart data={normalizedData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 9 }} tickFormatter={formatValue} />
            <Tooltip formatter={formatValue} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#465FFF"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "pie" || chartType === "donut") {
      return (
        <ResponsiveContainer width="100%" height={compact ? 160 : 200}>
          <PieChart>
            <Pie
              data={normalizedData}
              cx="50%"
              cy="50%"
              innerRadius={chartType === "donut" ? 45 : 0}
              outerRadius={75}
              dataKey="value"
            >
              {normalizedData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatValue} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={compact ? 160 : 200}>
        <BarChart data={normalizedData}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={formatValue} />
          <Tooltip formatter={formatValue} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {normalizedData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        padding: "16px",
        marginTop: "8px",
        width: "100%",
        maxWidth: "520px",
      }}
    >
      <button
        onClick={downloadChart}
        style={{
          fontSize: "11px",
          background: "transparent",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "4px 10px",
          cursor: "pointer",
          float: "right",
          color: "#64748b",
          marginBottom: "4px",
        }}
      >
        ⬇ Save PNG
      </button>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#1C2434",
          marginBottom: "12px",
        }}
      >
        {chartTitle}
      </p>

      <div
        ref={chartRef}
        style={{ background: "white", padding: "8px", clear: "both" }}
      >
        {renderChart()}
      </div>

      {normalizedData.length > 0 && (
        (() => {
          const confidence = getConfidence(normalizedData);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
                padding: "6px 10px",
                background: "#f8fafc",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  background: "#e2e8f0",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: confidence.score + "%",
                    background: confidence.color,
                    borderRadius: "2px",
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: confidence.color,
                  whiteSpace: "nowrap",
                }}
              >
                {confidence.label} · {confidence.score}%
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  whiteSpace: "nowrap",
                }}
              >
                {normalizedData.length} data points
              </div>
            </div>
          );
        })()
      )}

      {insight && (
        <div
          style={{
            background: "#EFF4FF",
            borderRadius: "8px",
            padding: "10px 12px",
            marginTop: "12px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#465FFF",
              marginBottom: "4px",
            }}
          >
            AI Insight
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#374151",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            {insight}
          </p>
        </div>
      )}

      <button
        onClick={() =>
          window.open("http://localhost:5000/dashboard", "_blank")
        }
        style={{
          width: "100%",
          background: "#465FFF",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          marginTop: "12px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        Open Full Dashboard ↗
      </button>
    </div>
  );
}
