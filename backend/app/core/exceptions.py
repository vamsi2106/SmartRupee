class SmartRupeeError(Exception):
    """Base exception for SmartRupee domain errors."""
    pass


class InvalidFinancialDataError(SmartRupeeError):
    """Raised when provided financial inputs are invalid or incomplete."""
    pass


class AgentExecutionError(SmartRupeeError):
    """Raised when an AI agent fails to process or return valid JSON."""
    pass


class DatabaseError(SmartRupeeError):
    """Raised when a database operation fails."""
    pass
