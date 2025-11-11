"""
Input Validation Logic

Comprehensive validation of plan parameters beyond basic type checking.
"""

from typing import List
from .models import CalculateRequest, ValidateResponse, ValidationError


def validate_plan_parameters(plan: CalculateRequest) -> ValidateResponse:
    """
    Validate plan parameters comprehensively.

    Checks:
    - Deductible ranges
    - MOOP ranges and relationships
    - Coinsurance rates
    - Copay values
    - Metal tier classification
    - Logical consistency

    Args:
        plan: CalculateRequest to validate

    Returns:
        ValidateResponse with validation results
    """
    errors: List[ValidationError] = []
    warnings: List[str] = []

    # Validate deductibles
    if plan.deductible_individual < 0:
        errors.append(ValidationError(
            field="deductible_individual",
            error="VALUE_NEGATIVE",
            message="Deductible cannot be negative"
        ))

    if plan.deductible_individual > 15000:
        errors.append(ValidationError(
            field="deductible_individual",
            error="VALUE_TOO_HIGH",
            message="Deductible exceeds reasonable maximum of $15,000"
        ))

    if plan.deductible_family < plan.deductible_individual:
        errors.append(ValidationError(
            field="deductible_family",
            error="INVALID_RELATIONSHIP",
            message="Family deductible must be >= individual deductible"
        ))

    # Validate MOOP
    FEDERAL_MOOP_INDIVIDUAL_2026 = 10600
    FEDERAL_MOOP_FAMILY_2026 = 21200

    if plan.moop_individual > FEDERAL_MOOP_INDIVIDUAL_2026:
        errors.append(ValidationError(
            field="moop_individual",
            error="EXCEEDS_FEDERAL_LIMIT",
            message=f"Individual MOOP exceeds 2026 federal limit of ${FEDERAL_MOOP_INDIVIDUAL_2026:,}"
        ))

    if plan.moop_family > FEDERAL_MOOP_FAMILY_2026:
        errors.append(ValidationError(
            field="moop_family",
            error="EXCEEDS_FEDERAL_LIMIT",
            message=f"Family MOOP exceeds 2026 federal limit of ${FEDERAL_MOOP_FAMILY_2026:,}"
        ))

    if plan.moop_individual < plan.deductible_individual:
        errors.append(ValidationError(
            field="moop_individual",
            error="INVALID_RELATIONSHIP",
            message="Individual MOOP must be >= individual deductible"
        ))

    if plan.moop_family < plan.deductible_family:
        errors.append(ValidationError(
            field="moop_family",
            error="INVALID_RELATIONSHIP",
            message="Family MOOP must be >= family deductible"
        ))

    if plan.moop_family < plan.moop_individual:
        errors.append(ValidationError(
            field="moop_family",
            error="INVALID_RELATIONSHIP",
            message="Family MOOP should be >= individual MOOP"
        ))

    # Validate coinsurance
    if not 0 <= plan.coinsurance_medical <= 1:
        errors.append(ValidationError(
            field="coinsurance_medical",
            error="OUT_OF_RANGE",
            message="Coinsurance must be between 0 and 1 (e.g., 0.20 = 20%)"
        ))

    if plan.drug_coinsurance is not None:
        if not 0 <= plan.drug_coinsurance <= 1:
            errors.append(ValidationError(
                field="drug_coinsurance",
                error="OUT_OF_RANGE",
                message="Drug coinsurance must be between 0 and 1"
            ))

    # Validate copays are reasonable
    copay_fields = [
        ("primary_care_copay", plan.primary_care_copay, 500),
        ("specialist_copay", plan.specialist_copay, 500),
        ("er_copay", plan.er_copay, 1000),
        ("urgent_care_copay", plan.urgent_care_copay, 500),
        ("generic_copay", plan.generic_copay, 200),
        ("preferred_brand_copay", plan.preferred_brand_copay, 500),
        ("non_preferred_copay", plan.non_preferred_copay, 500),
        ("specialty_drug_copay", plan.specialty_drug_copay, 1000),
        ("lab_work_copay", plan.lab_work_copay, 500),
        ("imaging_copay", plan.imaging_copay, 1000),
    ]

    for field_name, value, max_reasonable in copay_fields:
        if value < 0:
            errors.append(ValidationError(
                field=field_name,
                error="VALUE_NEGATIVE",
                message=f"{field_name} cannot be negative"
            ))
        elif value > max_reasonable:
            warnings.append(
                f"{field_name} of ${value:,.2f} is unusually high "
                f"(typical max: ${max_reasonable:,.2f})"
            )

    # Validate metal tier
    valid_tiers = ['Bronze', 'Silver', 'Gold', 'Platinum']
    if plan.metal_tier not in valid_tiers:
        errors.append(ValidationError(
            field="metal_tier",
            error="INVALID_VALUE",
            message=f"metal_tier must be one of {valid_tiers}"
        ))

    # Check for unusual relationships (warnings, not errors)
    if plan.deductible_individual == 0 and plan.coinsurance_medical > 0:
        warnings.append(
            "Plan has no deductible but has coinsurance. "
            "This is unusual but valid."
        )

    if plan.deductible_individual == plan.moop_individual:
        warnings.append(
            "Deductible equals MOOP. This means no coinsurance range."
        )

    # Check family multipliers
    if plan.deductible_family > 0:
        family_ratio = plan.deductible_family / plan.deductible_individual
        if family_ratio > 3:
            warnings.append(
                f"Family deductible is {family_ratio:.1f}x individual. "
                "Typical ratio is 2x."
            )

    # Check HSA contribution vs deductible
    if plan.hsa_contribution > plan.deductible_individual:
        warnings.append(
            "HSA contribution exceeds deductible. "
            "This will effectively eliminate member cost below deductible."
        )

    # Validate HSA eligibility requirements (if HSA > 0)
    if plan.hsa_contribution > 0:
        # HSA-eligible plans must have minimum deductible
        HSA_MIN_DEDUCTIBLE_2026 = 1650  # Individual
        if plan.deductible_individual < HSA_MIN_DEDUCTIBLE_2026:
            errors.append(ValidationError(
                field="deductible_individual",
                error="HSA_INELIGIBLE",
                message=f"HSA contribution requires minimum deductible of ${HSA_MIN_DEDUCTIBLE_2026:,} (2026)"
            ))

    # Check if plan design is internally consistent
    total_copays = (
        plan.primary_care_copay +
        plan.specialist_copay +
        plan.er_copay +
        plan.generic_copay +
        plan.preferred_brand_copay
    )

    if total_copays == 0 and plan.coinsurance_medical == 0 and plan.deductible_individual == 0:
        warnings.append(
            "Plan appears to have no cost-sharing (no deductible, coinsurance, or copays). "
            "This would result in 100% AV."
        )

    # Return validation result
    is_valid = len(errors) == 0

    return ValidateResponse(
        is_valid=is_valid,
        errors=errors,
        warnings=warnings
    )


def validate_av_result(av_percent: float, metal_tier: str) -> List[str]:
    """
    Validate that calculated AV matches expected metal tier ranges.

    Args:
        av_percent: Calculated AV percentage
        metal_tier: Calculated metal tier

    Returns:
        List of warnings (empty if valid)
    """
    warnings = []

    # Metal tier ranges (with de minimis variation of ±2%)
    tier_ranges = {
        'Platinum': (88, 92),  # 90% ± 2%
        'Gold': (78, 82),      # 80% ± 2%
        'Silver': (68, 72),    # 70% ± 2%
        'Bronze': (58, 62),    # 60% ± 2%
    }

    if metal_tier in tier_ranges:
        min_av, max_av = tier_ranges[metal_tier]
        if not (min_av <= av_percent <= max_av):
            warnings.append(
                f"Calculated AV of {av_percent:.2f}% is outside expected "
                f"{metal_tier} range of {min_av}%-{max_av}%"
            )

    return warnings
