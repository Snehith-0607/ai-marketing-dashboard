import pandas as pd
from typing import Optional

class QueryCache:
    def __init__(self, max_size: int = 10):
        self.cache = {}
        self.queries = []
        self.max_size = max_size

    def get_cached_result(self, query: str) -> Optional[pd.DataFrame]:
        """
        Retrieves the cached dataframe result for a given query if it exists.
        Returns a copy to prevent accidental modifications to the cache.
        """
        if query in self.cache:
            return self.cache[query].copy()
        return None

    def store_cache(self, query: str, result: pd.DataFrame):
        """
        Stores the dataframe result for a query in the cache.
        Keeps only the last `max_size` queries (FIFO).
        """
        if query not in self.cache:
            self.queries.append(query)
            # Store a copy to protect the cache reference
            self.cache[query] = result.copy()

            # Enforce FIFO limit
            if len(self.queries) > self.max_size:
                oldest_query = self.queries.pop(0)
                del self.cache[oldest_query]
        else:
            # Overwrite the existing cached value
            self.cache[query] = result.copy()

# Global singleton instance
_cache = QueryCache()

def store_cache(query: str, result: pd.DataFrame):
    _cache.store_cache(query, result)

def get_cached_result(query: str) -> Optional[pd.DataFrame]:
    return _cache.get_cached_result(query)
