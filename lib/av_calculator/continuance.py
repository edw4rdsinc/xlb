"""
Continuance table loading and management.

Handles loading continuance tables from JSON files and providing access.
"""

import json
from pathlib import Path
from typing import Dict, Optional
import numpy as np

from .models import ContinuanceTable
from .constants import METAL_TIERS, TABLE_TYPES, SERVICE_COLUMN_MAPPING


# Cache for loaded tables
_TABLE_CACHE: Dict[str, ContinuanceTable] = {}


def get_data_dir() -> Path:
    """Get the continuance tables data directory."""
    # Get the path relative to this file
    current_dir = Path(__file__).parent
    data_dir = current_dir.parent.parent / 'data' / 'continuance-tables'

    if not data_dir.exists():
        raise FileNotFoundError(f"Continuance tables directory not found: {data_dir}")

    return data_dir


def load_table_from_json(metal_tier: str, table_type: str) -> ContinuanceTable:
    """
    Load a single continuance table from JSON file.

    Args:
        metal_tier: Bronze, Silver, Gold, or Platinum
        table_type: 'med', 'rx', or 'combined'

    Returns:
        ContinuanceTable object with loaded data

    Raises:
        FileNotFoundError: If table file doesn't exist
        ValueError: If invalid metal tier or table type
    """
    if metal_tier not in METAL_TIERS:
        raise ValueError(f"Invalid metal tier: {metal_tier}. Must be one of {METAL_TIERS}")
    if table_type not in TABLE_TYPES:
        raise ValueError(f"Invalid table type: {table_type}. Must be one of {TABLE_TYPES}")

    # Build filename: bronze_med.json, silver_combined.json, etc.
    filename = f"{metal_tier.lower()}_{table_type}.json"
    data_dir = get_data_dir()
    file_path = data_dir / filename

    if not file_path.exists():
        raise FileNotFoundError(f"Table file not found: {file_path}")

    # Load JSON data
    with open(file_path, 'r') as f:
        data = json.load(f)

    # Extract core columns
    rows = data['data']
    row_count = len(rows)

    up_to = np.zeros(row_count)
    pct_enrollees = np.zeros(row_count)
    maxd = np.zeros(row_count)
    bucket = np.zeros(row_count)

    for i, row in enumerate(rows):
        # Handle 'Up To' - may be 'Unlimited' in last row
        up_to_val = row['Up To']
        if up_to_val is None or str(up_to_val).strip().lower() == 'unlimited':
            up_to[i] = 1e12  # Use very large number for unlimited
        else:
            try:
                up_to[i] = float(up_to_val)
            except (ValueError, TypeError):
                up_to[i] = 0.0

        # Handle 'Percent of Enrollees'
        pct_val = row['Percent of Enrollees']
        if pct_val is None:
            pct_enrollees[i] = 0.0
        else:
            try:
                pct_enrollees[i] = float(pct_val)
            except (ValueError, TypeError):
                pct_enrollees[i] = 0.0

        # Handle Max'd column - may have invalid values like '. '
        maxd_val = row["Avg. Cost per Enrollee (Max'd)"]
        if maxd_val is None or str(maxd_val).strip() in ('', '.', '. ', '.-'):
            maxd[i] = 0.0
        else:
            try:
                maxd[i] = float(maxd_val)
            except (ValueError, TypeError):
                maxd[i] = 0.0

        # Handle Bucket column - may have invalid values like '. '
        bucket_val = row["Avg. Cost per Enrollee (Bucket)"]
        if bucket_val is None or str(bucket_val).strip() in ('', '.', '. ', '.-'):
            bucket[i] = 0.0
        else:
            try:
                bucket[i] = float(bucket_val)
            except (ValueError, TypeError):
                bucket[i] = 0.0

    # Extract service data columns
    services = {}

    # Map service column names from table to service codes
    for col_name, service_code in SERVICE_COLUMN_MAPPING.items():
        # Check if this column exists in the table
        if col_name in rows[0]:
            service_data = np.zeros(row_count)
            for i, row in enumerate(rows):
                value = row.get(col_name)
                # Handle None/null values
                service_data[i] = float(value) if value is not None else 0.0
            services[service_code] = service_data

    return ContinuanceTable(
        metal_tier=metal_tier,
        table_type=table_type,
        up_to=up_to,
        pct_enrollees=pct_enrollees,
        maxd=maxd,
        bucket=bucket,
        services=services,
    )


def load_continuance_tables(metal_tier: str) -> Dict[str, ContinuanceTable]:
    """
    Load all three table types (med, rx, combined) for a metal tier.

    Args:
        metal_tier: Bronze, Silver, Gold, or Platinum

    Returns:
        Dictionary with keys 'med', 'rx', 'combined' mapping to ContinuanceTable objects

    Example:
        >>> tables = load_continuance_tables('Silver')
        >>> silver_combined = tables['combined']
        >>> print(f"Total expected cost: ${silver_combined.total_expected_cost:.2f}")
    """
    cache_key = f"{metal_tier}_all"

    # Check cache first
    if cache_key in _TABLE_CACHE:
        return {
            'med': _TABLE_CACHE.get(f"{metal_tier}_med"),
            'rx': _TABLE_CACHE.get(f"{metal_tier}_rx"),
            'combined': _TABLE_CACHE.get(f"{metal_tier}_combined"),
        }

    # Load all three tables
    tables = {}
    for table_type in TABLE_TYPES:
        table = load_table_from_json(metal_tier, table_type)
        tables[table_type] = table
        _TABLE_CACHE[f"{metal_tier}_{table_type}"] = table

    return tables


def get_continuance_table(metal_tier: str, table_type: str = 'combined') -> ContinuanceTable:
    """
    Get a specific continuance table, loading from cache or file.

    Args:
        metal_tier: Bronze, Silver, Gold, or Platinum
        table_type: 'med', 'rx', or 'combined' (default: 'combined')

    Returns:
        ContinuanceTable object

    Example:
        >>> silver = get_continuance_table('Silver', 'combined')
        >>> print(f"Rows: {len(silver)}")
    """
    cache_key = f"{metal_tier}_{table_type}"

    if cache_key not in _TABLE_CACHE:
        table = load_table_from_json(metal_tier, table_type)
        _TABLE_CACHE[cache_key] = table

    return _TABLE_CACHE[cache_key]


def clear_cache():
    """Clear the table cache. Useful for testing or memory management."""
    global _TABLE_CACHE
    _TABLE_CACHE = {}


def preload_all_tables():
    """
    Preload all 12 continuance tables into cache.

    Call this at application startup to avoid loading delays during calculations.
    """
    for metal_tier in METAL_TIERS:
        load_continuance_tables(metal_tier)
