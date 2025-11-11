"""
2026 AV Calculator - Python Implementation
Based on CMS Actuarial Value Calculator methodology

Main exports:
- calculate_av: Main calculation function
- PlanDesign: Data class for plan parameters
- ContinuanceTable: Data class for continuance tables
"""

from .calculator import calculate_av
from .models import PlanDesign, ContinuanceTable, AVResult
from .continuance import load_continuance_tables, get_continuance_table

__all__ = [
    'calculate_av',
    'PlanDesign',
    'ContinuanceTable',
    'AVResult',
    'load_continuance_tables',
    'get_continuance_table',
]

__version__ = '1.0.0'
