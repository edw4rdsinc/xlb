"""
Utility functions for AV calculation.

Table lookups, interpolation, and helper calculations.
"""

import numpy as np
from typing import Optional

from .models import TableRow, ContinuanceTable
from .constants import METAL_TIER_RANGES


def get_continuance_table_row(up_to_column: np.ndarray, amount: float) -> TableRow:
    """
    Find the row in the continuance table for a given spending amount.

    Uses binary search with linear interpolation between rows.

    Args:
        up_to_column: Array of cumulative spending levels
        amount: Dollar amount to locate

    Returns:
        TableRow with row_index and interpolation_factor

    Example:
        >>> up_to = np.array([0, 100, 200, 300, 400])
        >>> row = get_continuance_table_row(up_to, 150)
        >>> print(f"Row {row.row_index}, interpolation {row.interpolation_factor}")
        Row 1, interpolation 0.5
    """
    num_rows = len(up_to_column)

    # Handle edge cases
    if amount <= up_to_column[0]:
        return TableRow(row_index=0, interpolation_factor=0.0)

    if amount >= up_to_column[-1]:
        return TableRow(row_index=num_rows-1, interpolation_factor=0.0)

    # Binary search for correct row
    for i in range(1, num_rows):
        if amount == up_to_column[i]:
            return TableRow(row_index=i, interpolation_factor=0.0)

        elif amount < up_to_column[i]:
            # Amount falls between row i-1 and row i
            row_low = i - 1
            ppt = (amount - up_to_column[row_low]) / (up_to_column[i] - up_to_column[row_low])
            return TableRow(row_index=row_low, interpolation_factor=ppt)

    # Shouldn't reach here, but return last row as fallback
    return TableRow(row_index=num_rows-1, interpolation_factor=0.0)


def compute_row_value(data_column: np.ndarray, table_row: TableRow) -> float:
    """
    Interpolate value from a column using table row position.

    Args:
        data_column: Array of values (costs, frequencies, etc.)
        table_row: Position in table with interpolation factor

    Returns:
        Interpolated value

    Example:
        >>> costs = np.array([0, 100, 200, 300])
        >>> row = TableRow(row_index=1, interpolation_factor=0.5)
        >>> value = compute_row_value(costs, row)
        >>> print(value)  # 150.0
    """
    row_idx = table_row.row_index
    ppt = table_row.interpolation_factor

    if ppt == 0.0 or row_idx >= len(data_column) - 1:
        return float(data_column[row_idx])
    else:
        # Linear interpolation
        val_low = data_column[row_idx]
        val_high = data_column[row_idx + 1]
        return float(val_low + ppt * (val_high - val_low))


def deductible_adjustment(cost: float, frequency: float, copay: float,
                         subject_to_deductible: bool) -> float:
    """
    Calculate adjustment to deductible based on cost-sharing below deductible.

    Args:
        cost: Total cost of service at this spending level
        frequency: Number of service instances
        copay: Copay amount per instance
        subject_to_deductible: Whether service is subject to deductible

    Returns:
        Dollar amount to add to deductible target

    Logic:
        - If NOT subject to deductible (STD=False):
          Plan pays (cost - copay), so enrollee needs more spending to hit deductible
          Return max(0, cost - frequency * copay)

        - If subject to deductible (STD=True):
          Copay doesn't count toward deductible, so need more spending
          Return min(cost, frequency * copay)
    """
    if not subject_to_deductible:
        # Service NOT subject to deductible
        # Plan pays (cost - copay), so enrollee needs more spending to hit deductible
        return max(0.0, cost - frequency * copay)
    else:
        # Service IS subject to deductible
        # Copay doesn't count toward deductible, so need more spending
        return min(cost, frequency * copay)


def effective_coinsurance_numerator(cost: float, frequency: float, copay: float,
                                   coinsurance: float, subject_to_coinsurance: bool) -> float:
    """
    Calculate numerator for effective coinsurance rate (enrollee portion).

    Args:
        cost: Total cost of service
        frequency: Number of service instances
        copay: Copay amount
        coinsurance: Service coinsurance rate
        subject_to_coinsurance: Whether subject to coinsurance

    Returns:
        Dollar amount enrollee pays (for coinsurance calculation)

    Logic:
        - If NOT subject to coinsurance (STC=False):
          Service uses copay structure
          Return max(0, cost - frequency * copay)

        - If subject to coinsurance (STC=True):
          Service uses coinsurance
          Return cost * coinsurance
    """
    if not subject_to_coinsurance:
        # Service NOT subject to coinsurance (copay structure)
        return max(0.0, cost - frequency * copay)
    else:
        # Service IS subject to coinsurance
        return cost * coinsurance


def determine_metal_tier(av: float) -> str:
    """
    Determine metal tier from AV percentage.

    Uses de minimis variation ranges: ±2 percentage points allowed.

    Args:
        av: Actuarial value (0.0 to 1.0)

    Returns:
        Metal tier name: Platinum, Gold, Silver, Bronze, Below Bronze, or Above Platinum

    Example:
        >>> tier = determine_metal_tier(0.7227)
        >>> print(tier)  # "Silver"
    """
    for tier_name, (min_av, max_av) in METAL_TIER_RANGES.items():
        if min_av <= av <= max_av:
            return tier_name

    # Check if above or below all tiers
    if av >= 0.92:
        return "Above Platinum"
    elif av < 0.58:
        return "Below Bronze"
    else:
        # Falls in gap between tiers
        return "Out of Range"


def validate_plan_design(plan) -> list[str]:
    """
    Validate plan design parameters.

    Args:
        plan: PlanDesign object

    Returns:
        List of validation error/warning messages (empty if valid)
    """
    warnings = []

    # Check deductible vs MOOP
    if plan.deductible > plan.moop:
        warnings.append(f"Deductible (${plan.deductible}) exceeds MOOP (${plan.moop})")

    # Check coinsurance range
    if not 0 <= plan.coinsurance <= 1:
        warnings.append(f"Coinsurance ({plan.coinsurance}) must be between 0 and 1")

    # Check HSA contribution
    if plan.hsa_contribution > plan.deductible:
        warnings.append(
            f"HSA contribution (${plan.hsa_contribution}) exceeds deductible (${plan.deductible})"
        )

    # Preventive care checks
    if 'PREV' in plan.service_params:
        prev_params = plan.service_params['PREV']
        if prev_params.copay > 0:
            warnings.append("Preventive care must have $0 copay per ACA requirements")
        if prev_params.subject_to_deductible:
            warnings.append("Preventive care cannot be subject to deductible per ACA requirements")
        if prev_params.subject_to_coinsurance:
            warnings.append("Preventive care cannot be subject to coinsurance per ACA requirements")

    return warnings


def calculate_frequency(service_data: np.ndarray, table_row: TableRow) -> float:
    """
    Calculate frequency for a service at a given spending level.

    For now, returns 1.0 as a placeholder. In a full implementation,
    this would look up frequency from a separate column in the table.

    Args:
        service_data: Service cost data array
        table_row: Position in table

    Returns:
        Estimated frequency (number of service instances)
    """
    # TODO: Implement actual frequency lookup when frequency columns are added
    # For now, assume 1.0 instance per spending level
    return 1.0
