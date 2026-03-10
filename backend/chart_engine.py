import pandas as pd
import re

def select_chart(user_question: str, dataframe: pd.DataFrame) -> str:
    """
    Selects the best chart type based on the user's natural language question
    and the resulting SQL dataframe.
    
    Supported charts: bar, line, pie, funnel, heatmap
    
    Args:
        user_question (str): The natural language analytics question.
        dataframe (pd.DataFrame): The resulting SQLite data as a pandas dataframe.
        
    Returns:
        str: The optimal chart type.
    """
    question_lower = user_question.lower()
    
    # Check for explicit chart mentions in the query first
    if re.search(r'\b(line|trend|time|over time|history|date|daily|monthly|yearly)\b', question_lower):
        # Additional check: line charts generally expect 'Date' or time-based columns
        if any('date' in col.lower() or 'time' in col.lower() or 'day' in col.lower() for col in dataframe.columns):
            return "line"
        # If user explicitly asks for a trend but no explicit date column is present,
        # still prefer line chart if it's explicitly stated as a trend.
        if re.search(r'\b(line|trend)\b', question_lower):
             return "line"
             
    if re.search(r'\b(pie|distribution|share|percent|proportion)\b', question_lower):
        return "pie"
        
    if re.search(r'\b(funnel|conversion rate|drop-off|pipeline)\b', question_lower):
        return "funnel"
        
    if re.search(r'\b(heatmap|density|correlation)\b', question_lower):
        return "heatmap"

    # Default to bar chart for category comparisons (or if nothing else matches)
    return "bar"

if __name__ == "__main__":
    # Test cases
    df_dummy = pd.DataFrame({'Date': ['2023-01-01', '2023-01-02'], 'Revenue': [100, 200]})
    df_dummy2 = pd.DataFrame({'Campaign_Type': ['A', 'B'], 'Revenue': [100, 200]})
    
    print(select_chart("Show revenue over time", df_dummy))           # Expected: line
    print(select_chart("What is the revenue distribution?", df_dummy2)) # Expected: pie
    print(select_chart("Show marketing funnel performance", df_dummy2)) # Expected: funnel
    print(select_chart("Compare revenue by campaign type", df_dummy2))  # Expected: bar
