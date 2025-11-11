"""
Data models for AV Calculator

Defines data classes for plan parameters, continuance tables, and results.
"""

from dataclasses import dataclass, field
from typing import Dict, Optional, NamedTuple
import numpy as np


class TableRow(NamedTuple):
    """
    Represents a position in the continuance table with interpolation.

    Attributes:
        row_index: Index of the row in the table (0-based)
        interpolation_factor: Linear interpolation factor between rows (0.0 to 1.0)
    """
    row_index: int
    interpolation_factor: float


@dataclass
class ServiceParams:
    """
    Cost-sharing parameters for a single service type.

    Attributes:
        copay: Dollar copay amount per service
        coinsurance: Coinsurance rate (0.0 to 1.0), None = use plan coinsurance
        subject_to_deductible: Whether service is subject to deductible
        subject_to_coinsurance: Whether service is subject to coinsurance
    """
    copay: float = 0.0
    coinsurance: Optional[float] = None
    subject_to_deductible: bool = True
    subject_to_coinsurance: bool = True


@dataclass
class PlanDesign:
    """
    Complete plan design parameters for AV calculation.

    Required Parameters:
        deductible: Individual deductible amount
        moop: Individual maximum out-of-pocket
        coinsurance: General coinsurance rate (member share, e.g., 0.20 = 20%)
        metal_tier: Target metal tier (Bronze, Silver, Gold, Platinum)

    Optional Parameters:
        family_deductible: Family deductible (defaults to 2x individual)
        family_moop: Family MOOP (defaults to 2x individual)
        hsa_contribution: Employer HSA/HRA contribution
        service_params: Service-specific cost sharing overrides
    """
    # Core parameters (required)
    deductible: float
    moop: float
    coinsurance: float
    metal_tier: str = 'Silver'

    # Family coverage (optional)
    family_deductible: Optional[float] = None
    family_moop: Optional[float] = None

    # HSA/HRA (optional)
    hsa_contribution: float = 0.0

    # Service-specific parameters (optional)
    service_params: Dict[str, ServiceParams] = field(default_factory=dict)

    def __post_init__(self):
        """Validate and set defaults."""
        # Set family defaults if not provided
        if self.family_deductible is None:
            self.family_deductible = self.deductible * 2
        if self.family_moop is None:
            self.family_moop = self.moop * 2

        # Validate ranges
        if self.deductible < 0:
            raise ValueError("Deductible must be >= 0")
        if self.deductible > self.moop:
            raise ValueError("Deductible cannot exceed MOOP")
        if not 0 <= self.coinsurance <= 1:
            raise ValueError("Coinsurance must be between 0 and 1")
        if self.metal_tier not in ['Bronze', 'Silver', 'Gold', 'Platinum']:
            raise ValueError(f"Invalid metal tier: {self.metal_tier}")

    def get_service_copay(self, service_code: str) -> float:
        """Get copay for a service, or 0.0 if not specified."""
        if service_code in self.service_params:
            return self.service_params[service_code].copay
        return 0.0

    def get_service_coinsurance(self, service_code: str) -> float:
        """Get coinsurance for a service, or plan coinsurance if not specified."""
        if service_code in self.service_params:
            params = self.service_params[service_code]
            return params.coinsurance if params.coinsurance is not None else self.coinsurance
        return self.coinsurance

    def is_subject_to_deductible(self, service_code: str) -> bool:
        """Check if service is subject to deductible."""
        if service_code in self.service_params:
            return self.service_params[service_code].subject_to_deductible
        return True

    def is_subject_to_coinsurance(self, service_code: str) -> bool:
        """Check if service is subject to coinsurance."""
        if service_code in self.service_params:
            return self.service_params[service_code].subject_to_coinsurance
        return True


@dataclass
class ContinuanceTable:
    """
    Continuance table data for a specific metal tier and table type.

    Attributes:
        metal_tier: Bronze, Silver, Gold, or Platinum
        table_type: 'med', 'rx', or 'combined'
        up_to: Spending level thresholds (numpy array)
        pct_enrollees: Percent of enrollees in each bucket
        maxd: Expected cost at each spending level (Max'd column)
        bucket: Expected cost within bucket
        services: Dictionary of service cost arrays
    """
    metal_tier: str
    table_type: str
    up_to: np.ndarray
    pct_enrollees: np.ndarray
    maxd: np.ndarray
    bucket: np.ndarray
    services: Dict[str, np.ndarray]

    def __len__(self) -> int:
        """Return number of rows in table."""
        return len(self.up_to)

    def get_service_data(self, service_code: str) -> Optional[np.ndarray]:
        """Get service cost data array, or None if not available."""
        return self.services.get(service_code)

    @property
    def total_expected_cost(self) -> float:
        """Total expected cost (last row of maxd column)."""
        return float(self.maxd[-1])


@dataclass
class AVResult:
    """
    Results of AV calculation.

    Attributes:
        av: Actuarial value (0.0 to 1.0)
        av_percent: AV as percentage (0-100)
        metal_tier: Calculated metal tier classification
        total_plan_payment: Total expected plan payment
        total_allowed_cost: Total expected allowed costs
        plan_pay_below_deduct: Plan payment below deductible
        plan_pay_deduct_to_moop: Plan payment between deductible and MOOP
        plan_pay_above_moop: Plan payment above MOOP
        adjusted_deductible: Adjusted deductible in spending terms
        adjusted_moop: Adjusted MOOP in spending terms
        iterations_outer: Outer loop iterations
        iterations_inner: Average inner loop iterations
        calculation_time: Calculation time in milliseconds
        warnings: List of warning messages
    """
    av: float
    av_percent: float
    metal_tier: str
    total_plan_payment: float
    total_allowed_cost: float
    plan_pay_below_deduct: float
    plan_pay_deduct_to_moop: float
    plan_pay_above_moop: float
    adjusted_deductible: float
    adjusted_moop: float
    iterations_outer: int = 0
    iterations_inner: int = 0
    calculation_time: float = 0.0
    warnings: list = field(default_factory=list)

    def to_dict(self) -> dict:
        """Convert result to dictionary for serialization."""
        return {
            'av': round(self.av, 4),
            'av_percent': round(self.av_percent, 2),
            'metal_tier': self.metal_tier,
            'total_plan_payment': round(self.total_plan_payment, 2),
            'total_allowed_cost': round(self.total_allowed_cost, 2),
            'breakdown': {
                'below_deductible': round(self.plan_pay_below_deduct, 2),
                'deductible_to_moop': round(self.plan_pay_deduct_to_moop, 2),
                'above_moop': round(self.plan_pay_above_moop, 2),
            },
            'adjusted_values': {
                'deductible': round(self.adjusted_deductible, 2),
                'moop': round(self.adjusted_moop, 2),
            },
            'performance': {
                'iterations_outer': self.iterations_outer,
                'iterations_inner': self.iterations_inner,
                'calculation_time_ms': round(self.calculation_time, 2),
            },
            'warnings': self.warnings,
        }


@dataclass
class Accumulators:
    """
    Accumulator values during calculation.

    Used to track running totals during service processing.
    """
    beneficiary_pay_to_deduct: float = 0.0
    plan_pay: float = 0.0
    total_pay: float = 0.0
    eff_coins_numerator: float = 0.0

    def reset(self):
        """Reset all accumulators to zero."""
        self.beneficiary_pay_to_deduct = 0.0
        self.plan_pay = 0.0
        self.total_pay = 0.0
        self.eff_coins_numerator = 0.0
