class ContextManager:
    def __init__(self, max_queries: int = 5):
        self.queries = []
        self.max_queries = max_queries

    def store_query(self, query: str):
        """
        Stores the user's query in memory.
        Keeps only the last `max_queries` queries (FIFO).
        """
        self.queries.append(query)
        if len(self.queries) > self.max_queries:
            self.queries.pop(0)

    def get_context(self) -> str:
        """
        Returns the last 5 queries formatted as conversation context.
        """
        if not self.queries:
            return ""
            
        context_str = "Previous conversation:\n\n"
        for i, q in enumerate(self.queries, 1):
            context_str += f"{i}. {q}\n"
            
        return context_str

# Global instance for the module
_memory = ContextManager()

def store_query(query: str):
    _memory.store_query(query)

def get_context() -> str:
    return _memory.get_context()
