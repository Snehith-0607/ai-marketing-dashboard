import os
import io
import sqlite3
import pandas as pd
import logging
import requests as http_requests
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.data_engine import initialize_database, run_query
from backend.data_engine import load_base_data, get_table_columns, DB_PATH, TABLE_NAME

try:
    from backend.query_engine import generate_query
    from backend.insight_engine import generate_insight as llm_generate_insight
    from backend.chart_engine import select_chart
    from backend.context_manager import store_query, get_context
    from backend.response_formatter import format_response
    from backend.upload_handler import upload_dataset, detect_schema, store_dataset
    HAS_ADVANCED_ENGINES = True
except ImportError as e:
    logging.warning(f"Advanced engine modules not available: {e}")
    HAS_ADVANCED_ENGINES = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Marketing Analytics API")

@app.on_event("startup")
async def startup_event():
    try:
        logger.info("Loading base marketing data...")
        load_base_data()
        logger.info("Base marketing data loaded.")
    except Exception as e:
        logger.error(f"Failed to load base data: {e}")
    initialize_database()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    chart: str
    title: str
    data: list
    insight: str
    suggestions: list = []

def smart_sql(question: str) -> str:
    q = question.lower()
    try:
        cols = get_table_columns()
    except:
        cols = []
    col_lower = {c.lower(): c for c in cols}
    def find_col(*keywords):
        for kw in keywords:
            for cl, c in col_lower.items():
                if kw in cl:
                    return c
        return None
    revenue_col = find_col('revenue', 'sales', 'amount')
    campaign_col = find_col('campaign_type', 'campaign', 'type')
    channel_col = find_col('channel', 'platform', 'source')
    roi_col = find_col('roi', 'return')
    conversion_col = find_col('conversion', 'convert', 'leads')
    language_col = find_col('language', 'lang')
    group_col = campaign_col or channel_col or language_col
    metric_col = revenue_col or conversion_col or roi_col
    if not group_col or not metric_col:
        if len(cols) >= 2:
            return f'SELECT "{cols[0]}", COUNT(*) as count FROM {TABLE_NAME} GROUP BY "{cols[0]}" ORDER BY count DESC LIMIT 10'
        return f"SELECT * FROM {TABLE_NAME} LIMIT 10"
    if 'revenue' in q and 'campaign' in q:
        return f'SELECT "{campaign_col}", SUM("{revenue_col}") as total FROM {TABLE_NAME} GROUP BY "{campaign_col}" ORDER BY total DESC LIMIT 10'
    if 'roi' in q:
        return f'SELECT "{channel_col or group_col}", AVG("{roi_col or metric_col}") as avg_roi FROM {TABLE_NAME} GROUP BY "{channel_col or group_col}" ORDER BY avg_roi DESC LIMIT 10'
    if 'conversion' in q:
        return f'SELECT "{group_col}", SUM("{conversion_col or metric_col}") as total FROM {TABLE_NAME} GROUP BY "{group_col}" ORDER BY total DESC LIMIT 10'
    return f'SELECT "{group_col}", SUM("{metric_col}") as total FROM {TABLE_NAME} GROUP BY "{group_col}" ORDER BY total DESC LIMIT 10'

def pick_chart(sql: str, data: list) -> str:
    if not data:
        return "bar"
    if len(data) <= 5:
        return "pie"
    if any(k in sql.lower() for k in ['month', 'date', 'year']):
        return "line"
    return "bar"

def basic_insight(question: str, data: list) -> str:
    if not data:
        return "No data found for your query."
    top = data[0]
    keys = list(top.keys())
    if len(keys) >= 2:
        label = str(top[keys[0]])
        value = str(top[keys[1]])
        metric = keys[1].replace('_', ' ').title()
        return f"{label} leads with highest {metric} of {value}."
    return f"Found {len(data)} data points."

def run_simple_query(sql: str) -> list:
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(sql)
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        conn.close()
        return [dict(zip(columns, row)) for row in rows]
    except Exception as e:
        raise Exception(f"Query failed: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/summary")
async def summary_endpoint():
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql(f"SELECT * FROM {TABLE_NAME} LIMIT 1000", conn)
        conn.close()
        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "data": df.to_dict(orient="records"),
            "summary": f"Dataset with {len(df.columns)} columns"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a CSV dataset, detect its schema, and store it for analytics.
    """
    logger.info(f"Received file upload: {file.filename}")
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    try:
        # Pass the SpooledTemporaryFile to pandas
        try:
            # First try UTF-8
            contents = await file.read()
            df = upload_dataset(contents)
        except UnicodeDecodeError:
            # Reset file pointer and retry with latin1
            file.seek(0)
            contents = await file.read()
            df = upload_dataset(contents, encoding="latin1")
        
        # Detect schema
        schema_cols = detect_schema(df)
        
        # Store to SQLite
        store_dataset(df)
        
        return {
            "message": "Dataset uploaded successfully",
            "columns": schema_cols,
            "rows": len(df)
        }
    except Exception as e:
        logger.error(f"Dataset upload failed: {e}")
        contents = await file.read()
        df = None
        for enc in ['latin-1', 'cp1252', 'utf-8', 'utf-8-sig']:
            try:
                df = pd.read_csv(io.BytesIO(contents), encoding=enc)
                break
            except UnicodeDecodeError:
                continue
        if df is not None:
            conn = sqlite3.connect(DB_PATH)
            df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)
            conn.commit()
            conn.close()
            return {
                "status": "success",
                "rows": len(df),
                "columns": len(df.columns),
                "column_names": list(df.columns)
            }
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/query", response_model=QueryResponse)
def process_query(request: QueryRequest):
    """
    Endpoint to process a natural language question and return structured analytics.
    """
    question = request.question
    logger.info(f"Received question: {question}")
    
    try:
        if not HAS_ADVANCED_ENGINES:
            raise Exception("Advanced engine modules not available")
            
        # Retrieve previous conversation context
        context = get_context()
        
        # 1. Generate query using LLM
        query_info = generate_query(question, context)
        sql = query_info.get("sql")
        chart = query_info.get("chart", "bar")
        title = query_info.get("title", "Analysis Result")
        
        if not sql:
            raise ValueError("No SQL generated by query engine.")
            
        # 2. Execute SQL
        df = run_query(sql)
        data = df.to_dict(orient="records")
        
        # Override chart type using the intelligent chart engine
        chart = select_chart(question, df)
        
        # 3. Generate insight from the dataframe
        insight = llm_generate_insight(question, df)
        
        # 4. Return the constructed response
        store_query(question)
        formatted_payload = format_response(df, chart, title, insight)
        return QueryResponse(**formatted_payload)
        
    except Exception as e:
        logger.error(f"Advanced pipeline failed: {e}. Falling back...")
        
        sql = smart_sql(request.question)
        data = run_simple_query(sql)
        chart_type = pick_chart(sql, data)
        insight = basic_insight(request.question, data)
        return QueryResponse(
            chart=chart_type,
            title=request.question,
            data=data,
            insight=insight,
            suggestions=[
                "Which channel has highest ROI?",
                "Compare conversions by language",
                "Show top performing campaigns",
                "Revenue trend by month"
            ]
        )

if __name__ == "__main__":
    import uvicorn
    # You can run this directly with `python api.py`
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
