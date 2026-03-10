import pandas as pd
import sqlite3
import os
from backend.sql_validator import validate_sql
from backend.cache_manager import store_cache, get_cached_result

# Define paths relative to the current file's directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "data", "marketing_data.csv")
DB_PATH = os.path.join(BASE_DIR, "marketing.db")
TABLE_NAME = "marketing_data"

def get_connection():
    return sqlite3.connect(DB_PATH)

def load_base_data():
    try:
        df = None
        for enc in ['latin-1', 'cp1252', 'utf-8', 'utf-8-sig']:
            try:
                df = pd.read_csv(CSV_PATH, encoding=enc)
                break
            except UnicodeDecodeError:
                continue
        if df is None:
            raise Exception("Could not decode CSV")
        conn = get_connection()
        df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)
        conn.commit()
        conn.close()
        print(f"Loaded {len(df)} rows into {TABLE_NAME}")
        return True
    except Exception as e:
        print(f"Failed to load data: {e}")
        return False

def get_table_columns():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({TABLE_NAME})")
        cols = [row[1] for row in cursor.fetchall()]
        conn.close()
        return cols
    except:
        return []

def get_summary():
    try:
        conn = get_connection()
        df = pd.read_sql(f"SELECT * FROM {TABLE_NAME} LIMIT 1000", conn)
        conn.close()
        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "top_columns": list(df.columns[:8]),
            "summary": f"Dataset with {len(df.columns)} columns"
        }
    except Exception as e:
        return {"error": str(e)}

def load_data():
    """
    Reads the marketing data CSV and stores it into an SQLite database.
    """
    # Read the CSV
    df = pd.read_csv(CSV_PATH, encoding="ISO-8859-1")
    
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect(DB_PATH)
    
    # Convert and store the dataframe as an SQLite table
    df.to_sql(TABLE_NAME, conn, if_exists="replace", index=False)
    
    # Close the connection
    conn.close()

def initialize_database():
    """
    Initializes the SQLite database only if it doesn't exist.
    """
    if not os.path.exists(DB_PATH):
        print("Initializing database from CSV...")
        load_data()
        print("Database initialized successfully.")
        
def run_query(sql_query):
    """
    Executes the provided SQL query against the SQLite database 
    and returns the result as a pandas DataFrame.
    """
    
    # Validate SQL query before execution
    safe_query = validate_sql(sql_query)
    
    # Check if the result is cached
    cached_df = get_cached_result(safe_query)
    if cached_df is not None:
        print("Returning cached result for query.")
        return cached_df
        
    conn = sqlite3.connect(DB_PATH)
    
    # Execute query and load into dataframe
    df = pd.read_sql_query(safe_query, conn)
    
    # Close the connection
    conn.close()
    
    # Store the result in cache
    store_cache(safe_query, df)
    
    return df


def test_query():
    """
    Runs a test query to get the total revenue grouped by Campaign_Type
    (limited to 5 records) and returns the results as a dataframe.
    """
    query = '''
        SELECT Campaign_Type, SUM(Revenue)
        FROM marketing_data
        GROUP BY Campaign_Type
        LIMIT 5
    '''
    return run_query(query)

if __name__ == "__main__":
    # Ensure data is loaded
    print(f"Loading data from {CSV_PATH} into {DB_PATH}...")
    load_data()
    print("Data successfully loaded!")
    
    # Run the test query and print the results
    print("\nRunning test query:")
    result_df = test_query()
    print(result_df)
