import os
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_insight(user_question: str, dataframe: pd.DataFrame) -> str:
    """
    Generate business insights explaining the data using an LLM.
    
    Args:
        user_question (str): The natural language marketing question asked by the user.
        dataframe (pd.DataFrame): The pandas dataframe containing the SQL query results.
        
    Returns:
        str: A short business insight.
    """
    try:
        if dataframe is None or dataframe.empty:
            return "No data available to generate insights."

        # Convert the pandas dataframe into readable text for the LLM
        data_text = dataframe.to_string(index=False)
        
        system_prompt = (
            "You are a senior marketing analyst. Based on the provided data, generate a business insight.\n"
            "Rules:\n"
            "- Maximum 3 sentences\n"
            "- Focus on trends and comparisons\n"
            "- Highlight top and bottom performers\n"
            "- Avoid repeating the user question\n"
            "- Sound like a professional business report"
        )
        
        user_message = (
            f"User Question: {user_question}\n\n"
            f"Data:\n{data_text}\n\n"
            "Please provide the insight according to the rules."
        )
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        }
        
        # Send a request to OpenRouter
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        # Handle API errors safely
        response.raise_for_status()
        response_data = response.json()
        
        # Extract the generated insight
        insight = response_data.get("choices", [])[0].get("message", {}).get("content", "").strip()
        
        if not insight:
            raise ValueError("Empty response from the model.")
            
        # Return the insight as a string
        return insight
        
    except Exception:
        return "Insight could not be generated."
