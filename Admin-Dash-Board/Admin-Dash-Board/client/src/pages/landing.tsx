import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Sparkles,
  MessageSquare,
  BarChart3,
  Zap,
  Upload,
  Brain,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardPreviewPath from "@assets/screenshot-1773141200441.png";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const barData = [
  { region: "East", value: 420 },
  { region: "West", value: 380 },
  { region: "North", value: 310 },
  { region: "South", value: 280 },
];

function Navbar() {
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.location.href = "/"}
          >
            <img
              src="/artha-nav-logo.png"
              alt="Artha"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
            />
            <span className="text-xl font-bold text-gray-900" data-testid="text-logo">Artha</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Upload Data", path: "/upload" },
              { label: "Artha Lens", path: "/chat" },
              { label: "Dashboard", path: "/dashboard" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors"
                data-testid={`link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-sm text-gray-600"
              data-testid="button-login"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] text-white rounded-full px-6 text-sm shadow-lg shadow-blue-200/50"
              data-testid="button-try-demo"
            >
              Try Demo
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3"
        >
          {["Features", "How it works", "Tech Stack", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="block text-sm text-gray-600 font-medium py-2" data-testid={`link-mobile-${item.toLowerCase().replace(/\s/g, "-")}`}>
              {item}
            </a>
          ))}
          <Button onClick={() => navigate("/upload")} className="w-full bg-[#465FFF] text-white rounded-full text-sm" data-testid="button-mobile-try-demo">
            Try Demo
          </Button>
        </motion.div>
      )}
    </nav>
  );
}

function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#F0F4FF] via-[#F8FAFF] to-white">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#465FFF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7B8AFF]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <img
            src="/artha-hero-logo.png"
            alt="Artha"
            style={{ height: "80px", width: "auto", objectFit: "contain", marginBottom: "16px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
          />
          <div className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-4 py-1.5 mb-6 text-xs text-gray-500 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#465FFF]" />
            AI-Powered Analytics — Find Meaning in Your Data
            <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] max-w-4xl mx-auto tracking-tight"
          data-testid="text-hero-title"
        >
          Find{" "}
          <span className="bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] bg-clip-text text-transparent">
            Meaning
          </span>{" "}
          in Your Data
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          Upload your dataset, ask questions in plain English, and get 
          AI-powered insights with beautiful dashboards. No SQL needed.
        </motion.p>

        {/* ─── Marquee Ticker ─── */}
        <div style={{
          width: "100%",
          overflow: "hidden",
          padding: "16px 0",
          marginBottom: "32px",
          marginTop: "24px",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9"
        }}>
          <div style={{
            display: "inline-flex",
            animation: "marquee 30s linear infinite",
            whiteSpace: "nowrap"
          }}>
            {[
              "Revenue by Campaign", "ROI Analysis", "Conversion Trends",
              "Channel Performance", "Engagement Score", "Customer Segments",
              "Acquisition Cost", "Monthly Trends", "Top Performers",
              "Language Analysis", "What-If Simulator", "Anomaly Detection",
              "Executive Reports",
              "Revenue by Campaign", "ROI Analysis", "Conversion Trends",
              "Channel Performance", "Engagement Score", "Customer Segments",
              "Acquisition Cost",
            ].map((item, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "16px",
                padding: "0 20px",
                fontSize: "11px",
                fontWeight: "600",
                color: "#94a3b8",
                letterSpacing: "1.5px",
                textTransform: "uppercase" as const
              }}>
                {item}
                <span style={{
                  display: "inline-block",
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "#cbd5e1"
                }}/>
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0) }
            100% { transform: translateX(-50%) }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            onClick={() => navigate("/upload")}
            className="bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] text-white rounded-full px-8 py-3 text-sm font-medium shadow-lg shadow-blue-200/50 h-12"
            data-testid="button-hero-try-demo"
          >
            Try Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 text-sm font-medium border-gray-200 h-12"
            data-testid="button-hero-github"
          >
            View GitHub
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-16 max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-[#465FFF]/10 via-[#7B8AFF]/5 to-[#465FFF]/10 rounded-3xl blur-2xl" />
          <div style={{
            width: "100%",
            maxWidth: "860px",
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
            border: "1px solid #e2e8f0"
          }}>
            {/* Browser chrome bar */}
            <div style={{
              background: "#f1f5f9",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid #e2e8f0"
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#ef4444"}}/>
                <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#f59e0b"}}/>
                <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#10b981"}}/>
              </div>
              <div style={{
                flex: 1,
                background: "white",
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "11px",
                color: "#94a3b8",
                textAlign: "center" as const
              }}>
                localhost:3000 — Artha Lens
              </div>
            </div>
            <img
              src="/artha-dashboard-preview.png"
              alt="Artha Dashboard"
              style={{ width: "100%", display: "block" }}
              data-testid="img-hero-preview"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.height = "400px";
                (e.currentTarget as HTMLImageElement).style.background = "linear-gradient(135deg, #465FFF11, #7B8AFF22)";
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const brands = ["Nykaa", "Swiggy", "Zomato", "Meesho", "Razorpay"];
  return (
    <motion.section {...fadeUp} className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm text-gray-400 mb-8">Trusted by innovative companies worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
          {brands.map((brand) => (
            <span key={brand} className="text-gray-300 font-bold text-lg tracking-wide" data-testid={`text-brand-${brand.toLowerCase().replace(/\s/g, "-")}`}>
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Stats Bar ─── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "56px",
        padding: "36px 24px",
        borderTop: "1px solid #f1f5f9",
        borderBottom: "1px solid #f1f5f9",
        marginTop: "32px",
        flexWrap: "wrap" as const
      }}>
        {[
          { number: "55,555+", label: "Records Analyzed" },
          { number: "< 2s", label: "Response Time" },
          { number: "10+", label: "Chart Types" },
          { number: "100%", label: "Natural Language" }
        ].map((stat, i) => (
          <div key={i} style={{textAlign: "center" as const}}>
            <div style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#465FFF",
              letterSpacing: "-1px",
              marginBottom: "4px",
              lineHeight: 1
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#94a3b8",
              fontWeight: "600",
              textTransform: "uppercase" as const,
              letterSpacing: "0.8px"
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function ProblemSection() {
  return (
    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-[#465FFF] font-semibold mb-3 uppercase tracking-wider">The Problem</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6" data-testid="text-problem-title">
          Business Intelligence Shouldn't Be This Hard
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto">
          Most companies rely on technical teams to generate reports and dashboards. 
          Business users cannot easily access insights because they don't know SQL or 
          how to configure complex BI tools. This creates bottlenecks, delays, and missed opportunities.
        </p>
      </div>
    </motion.section>
  );
}

function SolutionSection() {
  const [, navigate] = useLocation();
  const queries = [
    "Show monthly sales revenue by region",
    "Compare product category sales",
    "Display revenue growth over time",
  ];

  return (
    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-[#465FFF] font-semibold mb-3 uppercase tracking-wider">The Solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6" data-testid="text-solution-title">
              Just Ask. Get Dashboards Instantly.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Users can simply ask questions in natural language, and the AI system will 
              generate dashboards automatically. No training needed. No technical skills required.
            </p>
            <div className="space-y-3 mb-8">
              {queries.map((q, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#E2E8F0]">
                  <MessageSquare className="w-4 h-4 text-[#465FFF] flex-shrink-0" />
                  <span className="text-sm text-gray-600">"{q}"</span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] text-white rounded-full px-6 text-sm"
              data-testid="button-solution-try"
            >
              Try It Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 ml-2">AI Dashboard</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Revenue by Region</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Bar dataKey="value" fill="#465FFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-[#EFF4FF] rounded-lg p-3">
              <p className="text-xs text-[#465FFF] font-medium">AI Insight</p>
              <p className="text-xs text-gray-600 mt-1">East region leads with $420K revenue, 10.5% above average.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: MessageSquare, title: "Natural Language Analytics", desc: "Ask questions about your data like a conversation. No SQL or coding needed.", color: "bg-blue-50 text-[#465FFF]" },
    { icon: Brain, title: "AI Chart Selection", desc: "The system automatically chooses the best visualization for your data.", color: "bg-purple-50 text-purple-600" },
    { icon: BarChart3, title: "Interactive Dashboards", desc: "Charts support hover tooltips, filtering, and real-time interaction.", color: "bg-emerald-50 text-emerald-600" },
    { icon: MessageSquare, title: "Follow-up Queries", desc: "Refine your dashboards with additional prompts and drill deeper.", color: "bg-amber-50 text-amber-600" },
    { icon: Upload, title: "CSV Upload Support", desc: "Upload your own datasets and start analyzing in seconds.", color: "bg-rose-50 text-rose-600" },
    { icon: Zap, title: "Real-Time Insights", desc: "Dashboards are generated instantly with AI-powered analysis.", color: "bg-cyan-50 text-cyan-600" },
  ];

  return (
    <>
    {/* ─── How It Works ─── */}
    <div style={{
      maxWidth: "960px",
      margin: "0 auto 72px",
      padding: "0 24px"
    }}>
      <div style={{ textAlign: "center" as const, marginBottom: "44px" }}>
        <div style={{
          fontSize: "11px", fontWeight: "700", color: "#465FFF",
          textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: "10px"
        }}>HOW IT WORKS</div>
        <div style={{
          fontSize: "30px", fontWeight: "800", color: "#1e293b",
          letterSpacing: "-0.5px", lineHeight: 1.2
        }}>From Question to Dashboard in 3 Steps</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {[
          { step: "01", title: "Upload Your Data", desc: "Drag and drop any CSV file. The system instantly detects columns, data types, and schema automatically.", color: "#465FFF" },
          { step: "02", title: "Ask in Plain English", desc: "Type any business question naturally. No SQL, no coding required. AI understands context and intent.", color: "#7B8AFF" },
          { step: "03", title: "Get Instant Dashboards", desc: "AI selects the right chart, fetches real data, and delivers actionable insights in under 2 seconds.", color: "#10b981" }
        ].map((s, i) => (
          <div key={i} style={{
            background: "white", borderRadius: "16px", padding: "28px 24px",
            border: "1px solid #f1f5f9", position: "relative" as const, overflow: "hidden" as const,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              position: "absolute" as const, top: "12px", right: "16px",
              fontSize: "52px", fontWeight: "900", color: s.color + "08",
              letterSpacing: "-2px", lineHeight: 1, userSelect: "none" as const
            }}>{s.step}</div>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: s.color + "12", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "13px", fontWeight: "800",
              color: s.color, marginBottom: "16px"
            }}>{s.step}</div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>{s.title}</div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>

    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm text-[#465FFF] font-semibold mb-3 uppercase tracking-wider">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-features-title">
            Everything You Need for Data Intelligence
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Powerful features that make data analysis accessible to everyone in your organization.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#465FFF]/20 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
              data-testid={`card-feature-${i}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
    </>
  );
}

function TechStackSection() {
  const techs = [
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Recharts", icon: "📊" },
    { name: "TailwindCSS", icon: "🎨" },
    { name: "TypeScript", icon: "📘" },
    { name: "PostgreSQL", icon: "🐘" },
  ];

  return (
    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]" id="tech-stack">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-[#465FFF] font-semibold mb-3 uppercase tracking-wider">Tech Stack</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Built with Modern Technologies
        </h2>
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Leveraging the best tools in the ecosystem for performance and reliability.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {techs.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0] flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
              data-testid={`card-tech-${t.name.toLowerCase()}`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-xs font-medium text-gray-600">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CTASection() {
  const [, navigate] = useLocation();

  return (
    <>
    {/* ─── Sample Queries Dark Section ─── */}
    <div style={{
      background: "#0f172a",
      padding: "72px 24px",
      marginTop: "0"
    }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" as const, marginBottom: "44px" }}>
          <div style={{
            fontSize: "11px", fontWeight: "700", color: "#465FFF",
            textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: "10px"
          }}>EXAMPLE QUERIES</div>
          <div style={{ fontSize: "30px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>
            Ask Anything About Your Data
          </div>
          <div style={{ fontSize: "14px", color: "#64748b", marginTop: "10px" }}>
            Type these exact questions or anything like them
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            "Show me revenue by campaign type",
            "Which channel has the highest ROI?",
            "What if we double the Instagram budget?",
            "Compare conversions by language",
            "Show monthly revenue trend over time",
            "Analyze engagement by customer segment",
            "Top 5 performing campaigns by revenue",
            "Generate an executive report"
          ].map((q, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "14px 18px", background: "rgba(255,255,255,0.03)",
              borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.2s", cursor: "default"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(70,95,255,0.15)";
              e.currentTarget.style.borderColor = "rgba(70,95,255,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            }}
            >
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "#465FFF", flexShrink: 0
              }}/>
              <span style={{
                fontSize: "13px", color: "rgba(255,255,255,0.75)",
                fontWeight: "400", lineHeight: 1.4
              }}>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#465FFF] to-[#3A50E0] rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" data-testid="text-cta-title">
              Start Exploring Your Data
            </h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Transform your data into actionable insights with the power of conversational AI.
            </p>
            <Button
              onClick={() => navigate("/upload")}
              className="bg-white text-[#465FFF] rounded-full px-8 py-3 text-sm font-semibold hover:bg-blue-50 h-12 shadow-lg"
              data-testid="button-cta-start"
            >
              Start Exploring Your Data
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
    </>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/artha-nav-logo.png"
              alt="Artha"
              style={{ height: "32px", width: "auto", objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
            />
            <span className="text-lg font-bold text-gray-900">Artha</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Artha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useEffect(() => {
    document.title = "Artha — Find Meaning in Your Data";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <TechStackSection />
      <CTASection />
      <Footer />
    </div>
  );
}
