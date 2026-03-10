import pandas as pd
import sqlite3
import os

# Define paths relative to the current file's directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "marketing_data.csv")
DB_PATH = os.path.join(BASE_DIR, "marketing.db")
TABLE_NAME = "marketing_data"

def load_data():
    """
    Reads the marketing data CSV and stores it into an SQLite database.
    """
    # Read the CSV
    df = pd.read_csv(CSV_PATH)
    
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect(DB_PATH)
    
    # Convert and store the dataframe as an SQLite table
    df.to_sql(TABLE_NAME, conn, if_exists="replace", index=False)
    
    # Close the connection
    conn.close()

def run_query(sql_query):
    """
    Executes the provided SQL query against the SQLite database 
    and returns the result as a pandas DataFrame.
    """
    conn = sqlite3.connect(DB_PATH)
    
    # Execute query and load into dataframe
    df = pd.read_sql_query(sql_query, conn)
    
    # Close the connection
    conn.close()
    
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
