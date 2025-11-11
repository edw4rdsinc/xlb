"""
Calculator Integration Module

Integrates with Agent 5's AV calculation engine.
Converts API request models to calculation engine format.
"""

import sys
from pathlib import Path

# Add lib directory to path for imports
lib_path = Path(__file__).parent.parent.parent / 'lib'
sys.path.insert(0, str(lib_path))

from av_calculator import calculate_av, PlanDesign, get_continuance_table
from av_calculator.models import ServiceParams, AVResult

from .models import CalculateRequest


def calculate_av_from_request(request: CalculateRequest) -> AVResult:
    """
    Calculate AV from API request.

    Converts the API request model to the internal calculation engine format
    and performs the AV calculation.

    Args:
        request: CalculateRequest from API

    Returns:
        AVResult with calculated values

    Raises:
        ValueError: If parameters are invalid
        RuntimeError: If calculation fails
    """
    # Build service parameters dictionary
    service_params = {}

    # Primary care
    if request.primary_care_copay > 0 or request.primary_care_std is not None:
        service_params['PC'] = ServiceParams(
            copay=request.primary_care_copay,
            subject_to_deductible=(
                request.primary_care_std
                if request.primary_care_std is not None
                else False  # Default: PC not subject to deductible
            ),
            subject_to_coinsurance=False,  # Copay structure
        )

    # Specialist
    if request.specialist_copay > 0 or request.specialist_std is not None:
        service_params['SP'] = ServiceParams(
            copay=request.specialist_copay,
            subject_to_deductible=(
                request.specialist_std
                if request.specialist_std is not None
                else False  # Default: Specialist not subject to deductible
            ),
            subject_to_coinsurance=False,
        )

    # Emergency room
    if request.er_copay > 0 or request.er_std is not None:
        service_params['ER'] = ServiceParams(
            copay=request.er_copay,
            subject_to_deductible=(
                request.er_std
                if request.er_std is not None
                else False  # Default: ER not subject to deductible
            ),
            subject_to_coinsurance=False,
        )

    # Inpatient hospital
    if request.inpatient_copay > 0:
        service_params['IP'] = ServiceParams(
            copay=request.inpatient_copay,
            subject_to_deductible=False,
            subject_to_coinsurance=False,
        )

    # Lab work
    if request.lab_work_copay > 0:
        service_params['LAB'] = ServiceParams(
            copay=request.lab_work_copay,
            subject_to_deductible=False,
            subject_to_coinsurance=False,
        )

    # Imaging
    if request.imaging_copay > 0:
        service_params['IMG'] = ServiceParams(
            copay=request.imaging_copay,
            subject_to_deductible=False,
            subject_to_coinsurance=False,
        )

    # Physical therapy
    if request.physical_therapy_copay > 0:
        service_params['ST'] = ServiceParams(
            copay=request.physical_therapy_copay,
            subject_to_deductible=False,
            subject_to_coinsurance=False,
        )

    # Prescription drugs
    drug_std = request.drugs_std if request.drugs_std is not None else False
    drug_coins = request.drug_coinsurance if request.drug_coinsurance is not None else None

    if request.generic_copay > 0 or drug_std:
        service_params['RXGEN'] = ServiceParams(
            copay=request.generic_copay,
            coinsurance=drug_coins,
            subject_to_deductible=drug_std,
            subject_to_coinsurance=False,
        )

    if request.preferred_brand_copay > 0 or drug_std:
        service_params['RXFORM'] = ServiceParams(
            copay=request.preferred_brand_copay,
            coinsurance=drug_coins,
            subject_to_deductible=drug_std,
            subject_to_coinsurance=False,
        )

    if request.non_preferred_copay > 0 or drug_std:
        service_params['RXNONFORM'] = ServiceParams(
            copay=request.non_preferred_copay,
            coinsurance=drug_coins,
            subject_to_deductible=drug_std,
            subject_to_coinsurance=False,
        )

    if request.specialty_drug_copay > 0 or drug_std:
        service_params['RXSPCLTY'] = ServiceParams(
            copay=request.specialty_drug_copay,
            coinsurance=drug_coins if drug_coins is not None else 1.0,  # Default: 100% member pays
            subject_to_deductible=True,
            subject_to_coinsurance=True,
        )

    # Preventive care (always $0, not subject to deductible per ACA)
    service_params['PREV'] = ServiceParams(
        copay=0.0,
        subject_to_deductible=False,
        subject_to_coinsurance=False,
    )

    # Build PlanDesign object
    plan = PlanDesign(
        deductible=request.deductible_individual,
        moop=request.moop_individual,
        coinsurance=request.coinsurance_medical,
        metal_tier=request.metal_tier,
        family_deductible=request.deductible_family,
        family_moop=request.moop_family,
        hsa_contribution=request.hsa_contribution,
        service_params=service_params,
    )

    # Get appropriate continuance table
    cont_table = get_continuance_table(
        metal_tier=request.metal_tier,
        table_type='combined'  # Use combined medical+drug table
    )

    # Calculate AV
    result = calculate_av(plan, cont_table)

    return result


def validate_calculation_inputs(request: CalculateRequest) -> None:
    """
    Additional validation beyond Pydantic model validation.

    Args:
        request: CalculateRequest to validate

    Raises:
        ValueError: If validation fails
    """
    # Check MOOP vs deductible
    if request.moop_individual < request.deductible_individual:
        raise ValueError(
            "Individual MOOP must be >= individual deductible"
        )

    if request.moop_family < request.deductible_family:
        raise ValueError(
            "Family MOOP must be >= family deductible"
        )

    # Check family values are reasonable multiples
    if request.deductible_family < request.deductible_individual:
        raise ValueError(
            "Family deductible should be >= individual deductible"
        )

    if request.moop_family < request.moop_individual:
        raise ValueError(
            "Family MOOP should be >= individual MOOP"
        )

    # Warn about unusual ratios (but don't fail)
    family_deduct_ratio = request.deductible_family / request.deductible_individual
    if family_deduct_ratio > 3:
        # This is unusual but not necessarily invalid
        pass

    # Check federal MOOP limits (2026 values)
    FEDERAL_MOOP_INDIVIDUAL_2026 = 10600
    FEDERAL_MOOP_FAMILY_2026 = 21200

    if request.moop_individual > FEDERAL_MOOP_INDIVIDUAL_2026:
        raise ValueError(
            f"Individual MOOP exceeds 2026 federal limit of "
            f"${FEDERAL_MOOP_INDIVIDUAL_2026:,}"
        )

    if request.moop_family > FEDERAL_MOOP_FAMILY_2026:
        raise ValueError(
            f"Family MOOP exceeds 2026 federal limit of "
            f"${FEDERAL_MOOP_FAMILY_2026:,}"
        )
