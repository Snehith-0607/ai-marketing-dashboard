import pandas as pd
import sqlite3
import os
import io

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "marketing.db")
TABLE_NAME = "marketing_data"

def upload_dataset(file_bytes):
    """
    Convert uploaded CSV bytes into pandas DataFrame.
    """

    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
    except UnicodeDecodeError:
        df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin1")

    return df

def detect_schema(dataframe: pd.DataFrame) -> list:
    """
    Detect column names automatically from the loaded DataFrame.
    
    Args:
        dataframe (pd.DataFrame): The input data.
        
    Returns:
        list: A list of column names present in the dataset.
    """
    if dataframe is None or dataframe.empty:
        return []
        
    # Extract column names and convert to a list
    columns = list(dataframe.columns)
    return columns

def store_dataset(dataframe: pd.DataFrame) -> None:
    """
    Store the dataset in the SQLite database, replacing any existing data.
    
    Args:
        dataframe (pd.DataFrame): The dataset to store.
    """
    if dataframe is None or dataframe.empty:
        raise ValueError("Cannot store an empty dataframe.")
        
    # Connect to the SQLite database
    conn = sqlite3.connect(DB_PATH)
    try:
        # Store DataFrame to SQL table
        dataframe.to_sql(TABLE_NAME, conn, if_exists="replace", index=False)
        print(f"Successfully stored dataset with {len(dataframe)} rows in '{TABLE_NAME}'.")
    except Exception as e:
        raise RuntimeError(f"Failed to store dataset to SQLite: {e}")
    finally:
        conn.close()

def get_db_schema() -> str:
    """
    Utility function to retrieve the current table schema from the database
    to update the AI SQL generator dynamically.
    
    Returns:
        str: A newline-separated string of column names.
    """
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (TABLE_NAME,))
        if not cursor.fetchone():
            return "No schema available."
            
        cursor.execute(f"PRAGMA table_info({TABLE_NAME});")
        columns = [row[1] for row in cursor.fetchall()]
        return "\n".join(columns)
    except Exception as e:
        print(f"Error fetching schema: {e}")
        return "No schema available."
    finally:
        conn.close()

if __name__ == "__main__":
    # Test the dataset handler functions
    test_csv_path = os.path.join(BASE_DIR, "data", "marketing_data.csv")
    if os.path.exists(test_csv_path):
        print("Testing upload_dataset...")
        df = upload_dataset(test_csv_path)
        
        print("\nTesting detect_schema...")
        schema_cols = detect_schema(df)
        print("Detected columns:", schema_cols)
        
        print("\nTesting store_dataset...")
        store_dataset(df)
        
        print("\nTesting dynamic schema retrieval...")
        print("Schema block for AI SQL Generator:\n" + get_db_schema())
    else:
        print("Test CSV not found.")
