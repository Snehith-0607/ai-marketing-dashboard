import os
import requests
import json
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_dataset_summary(dataframe: pd.DataFrame) -> dict:
    """
    Automatically analyze an uploaded dataset and generate a summary.
    
    Args:
        dataframe (pd.DataFrame): The pandas dataframe containing the uploaded dataset.
        
    Returns:
        dict: A dictionary structure representing the JSON properties requested.
    """
    if dataframe is None or dataframe.empty:
        return {
            "rows": 0,
            "columns": 0,
            "top_columns": [],
            "summary": "The dataset is empty or invalid."
        }

    # 1. Calculate Rows and Columns
    num_rows = len(dataframe)
    num_columns = len(dataframe.columns)
    
    # 2. Get Top Columns (selecting first 5 for sample)
    top_columns = list(dataframe.columns[:5])
    
    # 3. Create context for LLM
    # Sample top 5 rows
    data_sample = dataframe.head(5).to_string(index=False)
    
    # Provide system prompt to generate a short explanation
    system_prompt = (
        "You are an expert data analyst assistant. Based on the provided dataset overview, "
        "write a 1-2 sentence summary explaining what this dataset contains and its potential use case."
    )
    
    user_message = (
        f"Rows: {num_rows}\n"
        f"Columns: {num_columns}\n"
        f"Column Names: {list(dataframe.columns)}\n\n"
        f"Data Sample:\n{data_sample}\n\n"
        "Please provide the short explanation summary."
    )
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    }
    
    # Fallback summary in case the API call fails
    summary_text = "A dataset containing tabular information across various columns."
    
    try:
        # Send a request to OpenRouter
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        response_data = response.json()
        
        extracted_summary = response_data.get("choices", [])[0].get("message", {}).get("content", "").strip()
        
        if extracted_summary:
            summary_text = extracted_summary
            
    except Exception as e:
        print(f"Error generating LLM summary: {e}")

    # Return the dictionary representing the structured JSON response
    return {
        "rows": num_rows,
        "columns": num_columns,
        "top_columns": top_columns,
        "summary": summary_text
    }

if __name__ == "__main__":
    # Test case to verify functionality
    example_data = pd.DataFrame({
        "Campaign_Type": ["Email", "Social Media", "Search", "Email", "Affiliate"],
        "Revenue": [5000, 12000, 8000, 6000, 3000],
        "Clicks": [150, 420, 200, 180, 80],
        "Region": ["North America", "Europe", "Asia", "South America", "Europe"],
        "Duration": [14, 30, 21, 14, 45],
        "Date": ["2023-01-01", "2023-01-05", "2023-01-10", "2023-01-12", "2023-01-15"]
    })
    
    print("Testing generate_dataset_summary...\n")
    summary_json = generate_dataset_summary(example_data)
    
    # Print the resulting JSON
    print(json.dumps(summary_json, indent=4))
