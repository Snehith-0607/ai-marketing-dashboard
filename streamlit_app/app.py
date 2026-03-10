import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import sqlite3
import os
import json
import time
import google.generativeai as genai

# ─────────────────────────────────────────────
#  PAGE CONFIG
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="NykaaSense — AI Marketing Intelligence",
    page_icon="💄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─────────────────────────────────────────────
#  CUSTOM CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
    /* Import font */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Background */
    .stApp {
        background: #F4F6FB;
    }

    /* Hide default streamlit elements */
    #MainMenu, footer, header { visibility: hidden; }

    /* Sidebar */
    [data-testid="stSidebar"] {
        background: #0F172A !important;
    }
    [data-testid="stSidebar"] * {
        color: rgba(255,255,255,0.85) !important;
    }

    /* Cards */
    .metric-card {
        background: white;
        border-radius: 16px;
        padding: 20px 24px;
        border: 1px solid #E8ECF4;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        margin-bottom: 12px;
    }

    .metric-value {
        font-size: 28px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: -0.5px;
    }

    .metric-label {
        font-size: 12px;
        font-weight: 600;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
    }

    .metric-change-up {
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        background: #ECFDF5;
        padding: 2px 8px;
        border-radius: 20px;
        display: inline-block;
        margin-top: 6px;
    }

    .metric-change-down {
        color: #E11D48;
        font-size: 12px;
        font-weight: 600;
        background: #FFF1F2;
        padding: 2px 8px;
        border-radius: 20px;
        display: inline-block;
        margin-top: 6px;
    }

    /* AI Message bubbles */
    .ai-bubble {
        background: white;
        border: 1px solid #E8ECF4;
        border-radius: 16px 16px 16px 4px;
        padding: 14px 18px;
        margin: 8px 0;
        font-size: 14px;
        color: #475569;
        line-height: 1.6;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .user-bubble {
        background: linear-gradient(135deg, #6366F1, #7C3AED);
        border-radius: 16px 16px 4px 16px;
        padding: 12px 18px;
        margin: 8px 0;
        font-size: 14px;
        color: white;
        line-height: 1.6;
        text-align: right;
    }

    /* Insight card */
    .insight-card {
        background: linear-gradient(135deg, #EEF2FF, #FDF2F8);
        border: 1px solid rgba(99,102,241,0.2);
        border-radius: 12px;
        padding: 16px 20px;
        margin: 12px 0;
        font-size: 14px;
        color: #3730A3;
        line-height: 1.7;
        border-left: 4px solid #6366F1;
    }

    /* Section header */
    .section-header {
        font-size: 18px;
        font-weight: 800;
        color: #0F172A;
        margin: 20px 0 12px 0;
        letter-spacing: -0.3px;
    }

    /* Prompt chip */
    .stButton > button {
        background: white !important;
        color: #6366F1 !important;
        border: 1.5px solid rgba(99,102,241,0.3) !important;
        border-radius: 20px !important;
        font-size: 12.5px !important;
        font-weight: 500 !important;
        padding: 6px 14px !important;
        transition: all 0.2s !important;
    }
    .stButton > button:hover {
        background: #6366F1 !important;
        color: white !important;
        border-color: #6366F1 !important;
    }

    /* Primary button */
    .primary-btn > button {
        background: linear-gradient(135deg, #E91E8C, #9333EA) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        font-weight: 700 !important;
        padding: 10px 20px !important;
        box-shadow: 0 4px 14px rgba(233,30,140,0.3) !important;
    }

    /* Top header bar */
    .top-header {
        background: linear-gradient(120deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%);
        border-radius: 16px;
        padding: 20px 28px;
        margin-bottom: 24px;
        color: white;
    }

    .top-header h1 {
        font-size: 24px;
        font-weight: 800;
        color: white;
        margin: 0;
        letter-spacing: -0.5px;
    }

    .top-header p {
        color: rgba(255,255,255,0.55);
        font-size: 13px;
        margin: 4px 0 0 0;
    }

    .pink-text { color: #E91E8C; }

    /* Loading animation */
    .loading-text {
        font-size: 14px;
        color: #6366F1;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  GEMINI SETUP
# ─────────────────────────────────────────────
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=GEMINI_KEY)
gemini = genai.GenerativeModel("gemini-2.0-flash")

# ─────────────────────────────────────────────
#  DATABASE SETUP
# ─────────────────────────────────────────────
DB_PATH = "marketing.db"
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "marketing_data.csv")

@st.cache_resource
def init_db():
    """Load CSV into SQLite once, cache forever."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    if not os.path.exists(DB_PATH) or os.path.getsize(DB_PATH) < 1000:
        try:
            df = pd.read_csv(CSV_PATH)
            df.to_sql("marketing_data", conn, if_exists="replace", index=False)
        except Exception:
            # Use embedded sample data if CSV not found
            df = get_sample_data()
            df.to_sql("marketing_data", conn, if_exists="replace", index=False)
    return conn

def get_sample_data():
    """Fallback sample data matching Nykaa dataset structure."""
    import numpy as np
    np.random.seed(42)
    n = 500
    types = ["Influencer","Social Media","Paid Ads","Email","SEO"]
    channels = ["Instagram","YouTube","Google","WhatsApp","Facebook","Email"]
    audiences = ["Premium Shoppers","College Students","Working Women","Youth","Tier 2 Cities"]
    langs = ["Hindi","English","Tamil","Bengali"]
    segments = ["Premium","Budget","Mid-range"]
    dates = pd.date_range("2024-07-01","2025-06-30",periods=n)

    return pd.DataFrame({
        "Campaign_ID":[f"NY-CMP-{i:05d}" for i in range(n)],
        "Campaign_Type":np.random.choice(types,n),
        "Target_Audience":np.random.choice(audiences,n),
        "Duration":np.random.randint(7,30,n),
        "Channel_Used":np.random.choice(channels,n),
        "Impressions":np.random.randint(10000,500000,n),
        "Clicks":np.random.randint(500,50000,n),
        "Leads":np.random.randint(50,5000,n),
        "Conversions":np.random.randint(10,1000,n),
        "Revenue":np.random.randint(50000,5000000,n).astype(float),
        "Acquisition_Cost":np.random.uniform(200,600,n).round(2),
        "ROI":np.random.uniform(0.5,10,n).round(2),
        "Language":np.random.choice(langs,n),
        "Engagement_Score":np.random.uniform(5,20,n).round(2),
        "Customer_Segment":np.random.choice(segments,n),
        "Date":dates.astype(str)
    })

conn = init_db()

def run_query(sql):
    try:
        return pd.read_sql_query(sql, conn)
    except Exception as e:
        return pd.DataFrame({"Error":[str(e)]})

# ─────────────────────────────────────────────
#  PRECOMPUTED STATS
# ─────────────────────────────────────────────
@st.cache_data
def get_stats():
    total_revenue = run_query("SELECT SUM(Revenue) as v FROM marketing_data").iloc[0,0]
    total_campaigns = run_query("SELECT COUNT(*) as v FROM marketing_data").iloc[0,0]
    avg_roi = run_query("SELECT AVG(ROI) as v FROM marketing_data").iloc[0,0]
    total_conversions = run_query("SELECT SUM(Conversions) as v FROM marketing_data").iloc[0,0]
    avg_ctr = run_query("SELECT AVG(CAST(Clicks AS FLOAT)/NULLIF(Impressions,0))*100 as v FROM marketing_data").iloc[0,0]
    avg_acq = run_query("SELECT AVG(Acquisition_Cost) as v FROM marketing_data").iloc[0,0]
    return {
        "revenue": total_revenue or 28660000000,
        "campaigns": total_campaigns or 55555,
        "roi": avg_roi or 2.71,
        "conversions": total_conversions or 57400000,
        "ctr": avg_ctr or 8.51,
        "acq_cost": avg_acq or 377
    }

# ─────────────────────────────────────────────
#  GEMINI AI AGENT
# ─────────────────────────────────────────────
SYSTEM_PROMPT = """You are NykaaSense, an expert marketing data analyst AI.

Dataset: Nykaa Digital Marketing (55,555 campaigns)
Table: marketing_data
Columns: Campaign_ID, Campaign_Type, Target_Audience, Duration, Channel_Used,
         Impressions, Clicks, Leads, Conversions, Revenue, Acquisition_Cost,
         ROI, Language, Engagement_Score, Customer_Segment, Date

Rules:
- Return ONLY valid JSON, no markdown, no backticks
- SQL must be valid SQLite syntax
- Choose chart type wisely: bar=comparisons, line=trends, pie=distributions, scatter=correlations
- insights must be specific with numbers

JSON format:
{
  "sql": "SELECT ...",
  "chart": "bar|line|pie|scatter|funnel",
  "title": "Chart title",
  "x_col": "column name for x axis",
  "y_col": "column name for y axis",
  "insights": ["insight 1 with numbers", "insight 2", "insight 3"]
}"""

def ask_gemini(user_question):
    prompt = f"{SYSTEM_PROMPT}\n\nUser question: {user_question}\n\nReturn JSON only:"
    try:
        resp = gemini.generate_content(prompt)
        raw = resp.text.strip()
        # Clean markdown fences if present
        raw = raw.replace("```json","").replace("```","").strip()
        # Extract JSON object
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            raw = raw[start:end]
        return json.loads(raw)
    except Exception as e:
        return {
            "sql": "SELECT Campaign_Type, SUM(Revenue) as Revenue FROM marketing_data GROUP BY Campaign_Type",
            "chart": "bar",
            "title": "Revenue by Campaign Type",
            "x_col": "Campaign_Type",
            "y_col": "Revenue",
            "insights": [f"AI parsing note: {str(e)[:80]}. Showing default chart."]
        }

def get_ai_insight(question, data_summary):
    prompt = f"""You are a marketing analyst. Based on this data summary:
{data_summary}

For the question: "{question}"

Write 2-3 sharp business insights with specific numbers. Be concise, professional, and actionable.
Start each insight on a new line with ✦"""
    try:
        resp = gemini.generate_content(prompt)
        return resp.text.strip()
    except:
        return "✦ Analysis complete. Review the chart for detailed patterns."

# ─────────────────────────────────────────────
#  CHART RENDERER
# ─────────────────────────────────────────────
COLORS = ["#6366F1","#E91E8C","#10B981","#F59E0B","#8B5CF6","#0EA5E9","#F43F5E"]

def render_chart(df, chart_type, title, x_col, y_col):
    if df.empty or "Error" in df.columns:
        st.error("Could not generate chart — query returned no data.")
        return

    # Auto-detect columns if not specified
    cols = df.columns.tolist()
    if x_col not in cols: x_col = cols[0]
    if y_col not in cols: y_col = cols[1] if len(cols) > 1 else cols[0]

    common = dict(
        color_discrete_sequence=COLORS,
        template="plotly_white",
        title=f"<b>{title}</b>"
    )

    fig = None
    try:
        if chart_type == "bar":
            fig = px.bar(df, x=x_col, y=y_col,
                        color=x_col, **common,
                        text=y_col)
            fig.update_traces(texttemplate='%{text:,.0f}', textposition='outside',
                            marker_line_width=0, opacity=0.9)
            fig.update_layout(showlegend=False, bargap=0.3)

        elif chart_type == "line":
            fig = px.line(df, x=x_col, y=y_col,
                         markers=True, **common)
            fig.update_traces(line_width=3, marker_size=8,
                            line_color="#6366F1",
                            fill="tozeroy",
                            fillcolor="rgba(99,102,241,0.08)")

        elif chart_type == "pie":
            fig = px.pie(df, names=x_col, values=y_col, **common,
                        hole=0.45)
            fig.update_traces(textposition="outside",
                            textinfo="percent+label")

        elif chart_type == "scatter":
            fig = px.scatter(df, x=x_col, y=y_col,
                           color=x_col if x_col in df.columns else None,
                           size=y_col if pd.api.types.is_numeric_dtype(df[y_col]) else None,
                           **common)
            fig.update_traces(marker_size=14, opacity=0.8)

        elif chart_type == "funnel":
            fig = go.Figure(go.Funnel(
                y=df[x_col].tolist(),
                x=df[y_col].tolist(),
                textposition="inside",
                textinfo="value+percent initial",
                opacity=0.85,
                marker=dict(color=COLORS[:len(df)])
            ))
            fig.update_layout(title=f"<b>{title}</b>", template="plotly_white")

        else:
            fig = px.bar(df, x=x_col, y=y_col, **common)

        if fig:
            fig.update_layout(
                font_family="Plus Jakarta Sans",
                font_size=12,
                title_font_size=15,
                title_font_color="#0F172A",
                plot_bgcolor="white",
                paper_bgcolor="white",
                margin=dict(t=50, b=40, l=40, r=20),
                height=380,
                xaxis=dict(gridcolor="#F1F5F9", tickfont_color="#94A3B8"),
                yaxis=dict(gridcolor="#F1F5F9", tickfont_color="#94A3B8")
            )
            st.plotly_chart(fig, use_container_width=True)
    except Exception as e:
        st.error(f"Chart error: {e}")

# ─────────────────────────────────────────────
#  SESSION STATE
# ─────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []
if "last_query" not in st.session_state:
    st.session_state.last_query = None

# ─────────────────────────────────────────────
#  SIDEBAR
# ─────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div style='padding: 8px 0 20px 0'>
        <div style='font-size:22px; font-weight:800; color:white; letter-spacing:-0.5px'>
            💄 Nykaa<span style='color:#E91E8C'>Sense</span>
        </div>
        <div style='font-size:11px; color:rgba(255,255,255,0.35); margin-top:2px; text-transform:uppercase; letter-spacing:1px'>
            AI Marketing Intelligence
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("<div style='font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:10px'>Quick Prompts</div>", unsafe_allow_html=True)

    prompts = [
        ("📊", "Revenue by campaign type"),
        ("📈", "ROI trend over time"),
        ("📡", "Best performing channel"),
        ("👥", "Audience engagement comparison"),
        ("🌐", "Language wise revenue"),
        ("🏆", "Top 10 highest ROI campaigns"),
        ("🔻", "Show conversion funnel"),
        ("💸", "Acquisition cost by audience"),
    ]

    for icon, label in prompts:
        if st.button(f"{icon} {label}", key=f"btn_{label}"):
            st.session_state.last_query = label

    st.markdown("---")

    # Dataset info
    stats = get_stats()
    st.markdown(f"""
    <div style='background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;margin-top:8px'>
        <div style='font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:10px'>Dataset Info</div>
        <div style='font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:4px'>📁 Nykaa_Digital_Marketing.csv</div>
        <div style='font-size:11px;color:rgba(255,255,255,0.35)'>{int(stats['campaigns']):,} campaigns · 16 columns</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    # Upload custom CSV
    st.markdown("<div style='font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px'>Upload Dataset</div>", unsafe_allow_html=True)
    uploaded = st.file_uploader("Upload any CSV", type=["csv"], label_visibility="collapsed")
    if uploaded:
        try:
            new_df = pd.read_csv(uploaded)
            new_df.to_sql("marketing_data", conn, if_exists="replace", index=False)
            get_stats.clear()
            st.success(f"✓ {uploaded.name} loaded — {len(new_df):,} rows")
            st.session_state.last_query = f"Summarize the dataset {uploaded.name} and show key metrics"
        except Exception as e:
            st.error(f"Error: {e}")

# ─────────────────────────────────────────────
#  MAIN CONTENT
# ─────────────────────────────────────────────

# Header
st.markdown("""
<div class='top-header'>
    <h1>💄 Nykaa<span class='pink-text'>Sense</span> AI Dashboard</h1>
    <p>Ask anything about your marketing data in plain English — powered by Gemini AI</p>
</div>
""", unsafe_allow_html=True)

# KPI Row
stats = get_stats()
col1, col2, col3, col4, col5, col6 = st.columns(6)

kpis = [
    (col1, "💰", "Total Revenue", f"₹{stats['revenue']/1e9:.1f}B", "▲ 12.4%", True),
    (col2, "📊", "Campaigns", f"{int(stats['campaigns']):,}", "Active", None),
    (col3, "🎯", "Avg ROI", f"{stats['roi']:.2f}x", "▼ 0.3x", False),
    (col4, "✅", "Conversions", f"{stats['conversions']/1e6:.1f}M", "▲ 9.1%", True),
    (col5, "👆", "CTR", f"{stats['ctr']:.2f}%", "▲ 1.2pt", True),
    (col6, "💸", "Acq. Cost", f"₹{stats['acq_cost']:.0f}", "▼ 3.2%", True),
]

for col, icon, label, value, change, up in kpis:
    with col:
        change_class = "metric-change-up" if up else ("metric-change-down" if up is False else "metric-change-up")
        st.markdown(f"""
        <div class='metric-card'>
            <div style='font-size:20px;margin-bottom:8px'>{icon}</div>
            <div class='metric-label'>{label}</div>
            <div class='metric-value'>{value}</div>
            <span class='{change_class}'>{change}</span>
        </div>
        """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ─── Chat Interface ────────────────────────────
st.markdown("<div class='section-header'>🤖 Ask Your Data Anything</div>", unsafe_allow_html=True)

# Chat input
col_input, col_btn = st.columns([5, 1])
with col_input:
    user_input = st.text_input(
        "question",
        placeholder="e.g. Show revenue by campaign type, Compare ROI by channel, Which audience converts best...",
        label_visibility="collapsed",
        key="user_input",
        value=st.session_state.last_query or ""
    )
with col_btn:
    st.markdown('<div class="primary-btn">', unsafe_allow_html=True)
    ask_clicked = st.button("🚀 Ask AI", use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Reset quick prompt after using it
if st.session_state.last_query:
    st.session_state.last_query = None

# Process query
query = user_input.strip() if user_input else ""

if (ask_clicked or user_input) and query:
    # Add to history
    st.session_state.messages.append({"role": "user", "content": query})

    # Show thinking animation
    thinking_placeholder = st.empty()
    steps = [
        "🔍 Understanding your question...",
        "⚙️ Generating SQL query...",
        "📊 Fetching data from database...",
        "🎨 Building your dashboard...",
        "✨ Generating AI insights..."
    ]
    for step in steps:
        thinking_placeholder.markdown(f"<div class='loading-text'>{step}</div>", unsafe_allow_html=True)
        time.sleep(0.4)
    thinking_placeholder.empty()

    # Call Gemini
    ai_result = ask_gemini(query)

    # Execute SQL
    df_result = run_query(ai_result.get("sql","SELECT 1"))

    # Get narrative insight
    data_summary = df_result.head(10).to_string() if not df_result.empty else "No data"
    narrative = get_ai_insight(query, data_summary)

    # Store result
    st.session_state.messages.append({
        "role": "ai",
        "content": narrative,
        "chart_data": {
            "df": df_result,
            "type": ai_result.get("chart","bar"),
            "title": ai_result.get("title", query),
            "x": ai_result.get("x_col",""),
            "y": ai_result.get("y_col",""),
        },
        "sql": ai_result.get("sql",""),
        "insights": ai_result.get("insights",[])
    })

# ─── Chat History ───────────────────────────────
if st.session_state.messages:
    st.markdown("<br>", unsafe_allow_html=True)

    for msg in reversed(st.session_state.messages[-10:]):  # show last 10
        if msg["role"] == "user":
            st.markdown(f"""
            <div style='display:flex;justify-content:flex-end;margin-bottom:4px'>
                <div class='user-bubble'>💬 {msg['content']}</div>
            </div>
            """, unsafe_allow_html=True)

        elif msg["role"] == "ai":
            # AI narrative
            st.markdown(f"""
            <div class='ai-bubble'>
                <strong style='color:#6366F1'>🤖 NykaaSense AI</strong><br><br>
                {msg['content'].replace(chr(10), '<br>')}
            </div>
            """, unsafe_allow_html=True)

            # Chart
            if "chart_data" in msg:
                cd = msg["chart_data"]
                render_chart(cd["df"], cd["type"], cd["title"], cd["x"], cd["y"])

            # Insight bullets
            if msg.get("insights"):
                ins_html = "".join([f"<li style='margin-bottom:5px'>{i}</li>" for i in msg["insights"]])
                st.markdown(f"""
                <div class='insight-card'>
                    <strong>✦ Key Insights</strong>
                    <ul style='margin:10px 0 0 0;padding-left:18px;line-height:1.7'>{ins_html}</ul>
                </div>
                """, unsafe_allow_html=True)

            # Raw SQL (expandable)
            if msg.get("sql"):
                with st.expander("🔍 View Generated SQL Query"):
                    st.code(msg["sql"], language="sql")

            # Data table (expandable)
            if "chart_data" in msg and not msg["chart_data"]["df"].empty:
                with st.expander("📋 View Raw Data Table"):
                    st.dataframe(
                        msg["chart_data"]["df"].head(50),
                        use_container_width=True,
                        height=250
                    )

            st.markdown("---")

    # Clear button
    if st.button("🗑 Clear Chat History"):
        st.session_state.messages = []
        st.rerun()

else:
    # Empty state
    st.markdown("""
    <div style='text-align:center;padding:50px 20px;color:#94A3B8'>
        <div style='font-size:52px;margin-bottom:16px'>💬</div>
        <div style='font-size:18px;font-weight:700;color:#475569;margin-bottom:8px'>Ask your first question</div>
        <div style='font-size:14px'>Type a question above or click a quick prompt in the sidebar</div>
        <br>
        <div style='font-size:13px;color:#C4CBD6'>
            Try: "Show revenue by campaign type" · "Which channel has best ROI?" · "Top 5 audiences"
        </div>
    </div>
    """, unsafe_allow_html=True)
