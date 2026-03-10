import json
import os
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_query(user_prompt: str) -> dict:
    """
    Converts a natural language marketing analytics question into a
    structured JSON format with a SQL query, chart type, and title.
    Uses OpenRouter instead of Gemini.
    """

    fallback_response = {
        "sql": "SELECT Campaign_Type, SUM(Revenue) as total_revenue FROM marketing_data GROUP BY Campaign_Type LIMIT 10",
        "chart": "bar",
        "title": "Revenue by Campaign Type"
    }

    try:
        api_key = os.environ.get("OPENROUTER_API_KEY")

        if not api_key:
            print("Warning: OPENROUTER_API_KEY not set. Using fallback.")
            return fallback_response

        system_instruction = """
You are a senior marketing data analyst and BI engineer. Your job is to convert natural language 
questions about marketing analytics into structured SQL queries.

You must ONLY use the following table schema:

Table name: marketing_data

Columns:
Campaign_ID
Campaign_Type
Target_Audience
Duration
Channel_Used
Impressions
Clicks
Leads
Conversions
Revenue
Acquisition_Cost
ROI
Language
Engagement_Score
Customer_Segment
Date

Rules:
1. Your output MUST be strictly in JSON format.
2. JSON must contain keys: sql, chart, title
3. Only reference table marketing_data
4. Use aggregation when appropriate
5. Use GROUP BY when aggregating
6. Limit results to 50 rows

Chart types allowed:
bar, line, pie, funnel
"""

        prompt = f"{system_instruction}\n\nUser Question: {user_prompt}"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )

        result = response.json()

        response_text = result["choices"][0]["message"]["content"].strip()

        # Remove markdown formatting if model adds it
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        parsed_json = json.loads(response_text)

        required_keys = {"sql", "chart", "title"}
        if not all(key in parsed_json for key in required_keys):
            raise ValueError("Missing required keys in AI response")

        valid_charts = {"bar", "line", "pie", "funnel"}
        if parsed_json.get("chart") not in valid_charts:
            parsed_json["chart"] = "bar"

        return parsed_json

    except Exception as e:
        print(f"Error occurred: {e}. Returning fallback response.")
        return fallback_response


if __name__ == "__main__":

    example_prompt = "Which marketing channel generates the highest revenue?"

    print(f"Testing generate_query with prompt: '{example_prompt}'...\n")

    result = generate_query(example_prompt)

    print("Returned JSON output:")
    print(json.dumps(result, indent=4))