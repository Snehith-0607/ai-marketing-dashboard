import os
import requests
import json
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_suggestions(user_question: str, dataframe: pd.DataFrame) -> list:
    """
    Generate additional analytics queries the user might want to explore.
    
    Args:
        user_question (str): The natural language marketing question asked by the user.
        dataframe (pd.DataFrame): The pandas dataframe containing the SQL query results.
        
    Returns:
        list: A list of suggested questions (strings).
    """
    fallback_suggestions = [
        "Show ROI by channel",
        "Compare engagement score by language",
        "Show top performing campaigns"
    ]
    
    try:
        # If dataframe is empty, return generic fallback suggestions related to the marketing dashboard
        if dataframe is None or dataframe.empty:
            return fallback_suggestions

        # Convert a sample of the dataframe into readable text for the LLM
        # Limiting to top 5 rows to avoid token limit issues and save cost
        data_text = dataframe.head(5).to_string(index=False)
        
        system_prompt = (
            "You are a helpful data analytics assistant. Based on the user's initial question "
            "and the provided data sample, suggest 3 follow-up analytics questions the user "
            "might want to ask to explore the data further.\n"
            "Rules:\n"
            "- Return ONLY a valid JSON array of strings.\n"
            "- Example: [\"Show ROI by channel\", \"Compare engagement score by language\", \"Show top performing campaigns\"]\n"
            "- The questions must be very relevant to the available columns in the dataset.\n"
            "- Keep the questions short and analytical.\n"
            "- Do not include markdown formatting like ```json or newlines outside the array."
        )
        
        user_message = (
            f"Initial Question: {user_question}\n\n"
            f"Data Sample:\n{data_text}\n"
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
        
        # Send a request to OpenRouter
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        response.raise_for_status()
        response_data = response.json()
        
        # Extract the generated suggestions
        response_text = response_data.get("choices", [])[0].get("message", {}).get("content", "").strip()
        
        if not response_text:
            raise ValueError("Empty response from the model.")
            
        # Remove markdown formatting if the model adds it
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        parsed_json = json.loads(response_text.strip())
        
        if isinstance(parsed_json, list):
            return parsed_json[:3]
        else:
            raise ValueError("Response is not a valid JSON list.")
            
    except Exception as e:
        print(f"Error generating suggestions: {e}")
        return fallback_suggestions

if __name__ == "__main__":
    # Simple test case
    example_df = pd.DataFrame({
        "Campaign_Type": ["Email", "Social Media", "Search"],
        "Revenue": [5000, 12000, 8000],
        "ROI": [1.5, 2.1, 1.8]
    })
    
    question = "What is the total revenue by campaign type?"
    print(f"Testing generate_suggestions with question: '{question}'\n")
    suggestions = generate_suggestions(question, example_df)
    print("Suggestions List:")
    print(json.dumps(suggestions, indent=4))
