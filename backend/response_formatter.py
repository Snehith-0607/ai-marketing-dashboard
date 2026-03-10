import pandas as pd

def format_response(dataframe: pd.DataFrame, chart: str, title: str, insight: str) -> dict:
    """
    Converts pandas dataframe results into a structured JSON format 
    suitable for frontend charts.
    
    Args:
        dataframe (pd.DataFrame): The sql data.
        chart (str): The chart type string.
        title (str): The chart title.
        insight (str): The AI-generated insight string.
        
    Returns:
        dict: The final API JSON payload.
    """
    formatted_data = []
    
    # We expect standard SQL aggregations to return at least one or two columns.
    # Typically, the first column is the dimension (category) and the second is the measure (value).
    if dataframe is not None and not dataframe.empty:
        cols = dataframe.columns.tolist()
        
        if len(cols) >= 2:
            cat_col = cols[0]
            val_col = cols[1]
            
            for _, row in dataframe.iterrows():
                # Convert standard types to ensure JSON serialization
                val = row[val_col]
                formatted_data.append({
                    "category": str(row[cat_col]),
                    "value": float(val) if pd.notnull(val) else 0.0
                })
        elif len(cols) == 1:
            val_col = cols[0]
            # If only one column was returned (e.g., SELECT SUM(Revenue)), use 'Total' as category
            for _, row in dataframe.iterrows():
                val = row[val_col]
                formatted_data.append({
                    "category": "Total",
                    "value": float(val) if pd.notnull(val) else 0.0
                })
                
    return {
        "chart": chart,
        "title": title,
        "data": formatted_data,
        "insight": insight
    }

if __name__ == "__main__":
    import json
    # Simple test case
    df_test = pd.DataFrame({"Campaign_Type": ["Email", "Social"], "Revenue": [1500, 3000]})
    res = format_response(df_test, "bar", "Revenue by Campaign", "Social performs better.")
    print(json.dumps(res, indent=2))
