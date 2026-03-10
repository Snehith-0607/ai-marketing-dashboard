"""
data_engine.py
Backend data layer — loads CSV into SQLite and exposes query functions.
Snehith's module.
"""
import pandas as pd
import sqlite3
import os

DB_PATH = "marketing.db"
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "marketing_data.csv")


def load_data():
    """Load CSV into SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_csv(CSV_PATH)
    df.to_sql("marketing_data", conn, if_exists="replace", index=False)
    print(f"✅ Loaded {len(df):,} rows into {DB_PATH}")
    conn.close()
    return len(df)


def run_query(sql_query: str) -> pd.DataFrame:
    """Execute SQL query and return result as DataFrame."""
    conn = sqlite3.connect(DB_PATH)
    try:
        df = pd.read_sql_query(sql_query, conn)
        return df
    except Exception as e:
        print(f"Query error: {e}")
        return pd.DataFrame({"Error": [str(e)]})
    finally:
        conn.close()


def test_query():
    """Run test query to verify database is working."""
    sql = """
        SELECT Campaign_Type, 
               ROUND(SUM(Revenue), 2) as Total_Revenue,
               ROUND(AVG(ROI), 3) as Avg_ROI,
               COUNT(*) as Campaigns
        FROM marketing_data
        GROUP BY Campaign_Type
        ORDER BY Total_Revenue DESC
        LIMIT 5
    """
    df = run_query(sql)
    print("\n📊 Test Query Result:")
    print(df.to_string())
    return df


def get_summary_stats():
    """Return high-level stats for the dashboard."""
    stats = {}
    queries = {
        "total_revenue": "SELECT SUM(Revenue) FROM marketing_data",
        "total_campaigns": "SELECT COUNT(*) FROM marketing_data",
        "avg_roi": "SELECT ROUND(AVG(ROI),2) FROM marketing_data",
        "total_conversions": "SELECT SUM(Conversions) FROM marketing_data",
        "avg_ctr": "SELECT ROUND(AVG(CAST(Clicks AS FLOAT)/NULLIF(Impressions,0))*100, 2) FROM marketing_data",
        "avg_acq_cost": "SELECT ROUND(AVG(Acquisition_Cost),2) FROM marketing_data",
    }
    for key, sql in queries.items():
        result = run_query(sql)
        stats[key] = result.iloc[0, 0] if not result.empty else 0
    return stats


if __name__ == "__main__":
    print("🔄 Loading CSV into SQLite...")
    load_data()
    print("\n📈 Running test query...")
    test_query()
    print("\n📊 Summary stats:")
    for k, v in get_summary_stats().items():
        print(f"  {k}: {v}")
