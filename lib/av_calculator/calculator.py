"""
Main AV calculation engine.

Implements the nested convergence algorithm for Path 1 (Combined Deductible/MOOP).
"""

import math
import time
from typing import Optional

from .models import PlanDesign, ContinuanceTable, AVResult, Accumulators
from .continuance import get_continuance_table
from .services import process_all_services
from .utils import (
    get_continuance_table_row,
    compute_row_value,
    determine_metal_tier,
    validate_plan_design,
)
from .constants import MAX_ITERATIONS, TOLERANCE, COINSURANCE_DAMPING


def calculate_av_combined(plan: PlanDesign, cont_table: ContinuanceTable) -> AVResult:
    """
    Calculate Actuarial Value for a plan with combined medical+drug deductible and MOOP.

    This implements the iterative algorithm with nested convergence loops:
    - Outer loop: Adjust deductible/MOOP for copays and plan payments
    - Inner loop: Converge on effective coinsurance rate

    Args:
        plan: PlanDesign object with all parameters
        cont_table: ContinuanceTable with spending distributions

    Returns:
        AVResult object with calculated AV and breakdown

    Algorithm Overview:
        1. Initialize variables (deductible, MOOP targets)
        2. Outer loop: Adjust deductible/MOOP until convergence
           a. Inner loop: Converge on effective coinsurance rate
              i. Calculate adjusted deductible = target / coins
              ii. Find deductible row in table
              iii. Process all services at deductible level
              iv. Adjust deductible for plan payments below deductible
              v. Calculate achieved coinsurance rate
              vi. Update coinsurance estimate with damping
           b. Calculate beneficiary payment to MOOP
           c. Adjust MOOP if beneficiary would pay too much
        3. Calculate plan payments across all spending ranges
        4. Calculate final AV = plan_pay / total_cost
    """
    start_time = time.time()
    warnings = validate_plan_design(plan)

    # ========================================================================
    # STEP 1: INITIALIZE VARIABLES
    # ========================================================================

    deduct_target = plan.deductible
    moop_target = plan.moop

    # Get total expected cost (bottom row of maxd column)
    total_expected_cost = cont_table.total_expected_cost
    eff_coins_denominator = total_expected_cost

    # Convergence variables
    adjusted_deduct = -1.0
    adjusted_moop = moop_target  # Start with plan MOOP
    total_beneficiary_pay = -1.0

    # Check if deductible equals MOOP (special case)
    deduct_eq_moop = (plan.deductible == plan.moop)

    # Iteration counters
    iter_deduct = 0
    total_iter_coins = 0
    num_inner_loops = 0

    # Initialize accumulators (will be updated in loops)
    accumulators = Accumulators()

    # ========================================================================
    # STEP 2: OUTER LOOP - DEDUCTIBLE/MOOP ADJUSTMENT
    # ========================================================================

    while iter_deduct <= MAX_ITERATIONS:

        # Exit conditions
        if not deduct_eq_moop and deduct_target <= adjusted_moop:
            break  # Deductible satisfied

        if abs(total_beneficiary_pay - moop_target) < TOLERANCE:
            break  # Converged on MOOP

        # Initialize for this outer iteration
        moop_adjustment = 0.0
        coins = 1.0  # Start assuming 100% beneficiary payment in deductible range
        prior_coins = 0.0
        actual_coins_achieved = -1.0
        total_beneficiary_pay = 0.0

        # Reset accumulators for this outer iteration
        accumulators.reset()

        # ====================================================================
        # STEP 3: INNER LOOP - COINSURANCE CONVERGENCE
        # ====================================================================

        iter_coins = 0

        while iter_coins <= MAX_ITERATIONS:

            # Exit conditions
            if abs(prior_coins - actual_coins_achieved) < TOLERANCE:
                break  # Coinsurance converged

            if adjusted_deduct == 0 or coins == 0:
                break  # No deductible to process

            # Reset accumulators for this inner iteration
            accumulators.reset()

            # ================================================================
            # STEP 4: CALCULATE ADJUSTED DEDUCTIBLE
            # ================================================================

            # If enrollee only pays 80% below deductible (due to copays),
            # they need 25% more spending to reach the deductible target
            adjusted_deduct = deduct_target / coins if coins > 0 else deduct_target

            # ================================================================
            # STEP 5: FIND DEDUCTIBLE ROW IN CONTINUANCE TABLE
            # ================================================================

            deduct_row = get_continuance_table_row(cont_table.up_to, adjusted_deduct)

            # ================================================================
            # STEP 6: PROCESS ALL SERVICES AT DEDUCTIBLE LEVEL
            # ================================================================

            process_all_services(cont_table, plan, deduct_row, accumulators)

            # ================================================================
            # STEP 7: ADJUST DEDUCTIBLE FOR PLAN PAYMENTS BELOW DEDUCTIBLE
            # ================================================================

            if accumulators.plan_pay > 0:
                # Plan paid some services below deductible (not subject to deductible)
                # Enrollee needs more spending to reach deductible
                deduct_target += accumulators.plan_pay

            # ================================================================
            # STEP 8: CALCULATE ACHIEVED COINSURANCE RATE
            # ================================================================

            # What percentage did enrollee actually pay in deductible range?
            denominator = adjusted_deduct + moop_adjustment

            if denominator > 0:
                actual_coins_achieved = accumulators.beneficiary_pay_to_deduct / denominator
            else:
                actual_coins_achieved = 0.0

            # ================================================================
            # STEP 9: UPDATE COINSURANCE ESTIMATE
            # ================================================================

            prior_coins = coins

            if abs(coins - 1.0) < 0.01:
                # First iteration - use actual directly
                coins = actual_coins_achieved
            else:
                # Subsequent iterations - damped update for stability
                coins = (COINSURANCE_DAMPING * coins +
                        (1 - COINSURANCE_DAMPING) * actual_coins_achieved)

            # ================================================================
            # STEP 10: CHECK INNER LOOP CONVERGENCE
            # ================================================================

            if abs(prior_coins - actual_coins_achieved) < TOLERANCE:
                break

            iter_coins += 1

        # End of inner loop
        total_iter_coins += iter_coins
        num_inner_loops += 1

        # ====================================================================
        # STEP 11: CALCULATE BENEFICIARY PAYMENT TO MOOP
        # ====================================================================

        # Find MOOP row in table
        moop_row = get_continuance_table_row(cont_table.up_to, adjusted_moop)

        # Calculate spending between deductible and MOOP
        spending_above_deduct = adjusted_moop - adjusted_deduct

        # Calculate effective coinsurance rate
        if eff_coins_denominator > 0:
            eff_coins_rate = accumulators.eff_coins_numerator / eff_coins_denominator
        else:
            eff_coins_rate = 0.0

        # Total beneficiary payment = payment to deductible + coinsurance portion to MOOP
        total_beneficiary_pay = (accumulators.beneficiary_pay_to_deduct +
                                spending_above_deduct * eff_coins_rate)

        # ====================================================================
        # STEP 12: ADJUST MOOP IF NEEDED
        # ====================================================================

        if total_beneficiary_pay > moop_target:
            # Beneficiary would pay too much - reduce spending ceiling
            deficit = total_beneficiary_pay - moop_target

            if eff_coins_rate > 0:
                adjusted_moop -= deficit / eff_coins_rate
            else:
                adjusted_moop = adjusted_deduct  # Fallback

        # ====================================================================
        # STEP 13: CHECK OUTER LOOP CONVERGENCE
        # ====================================================================

        if abs(total_beneficiary_pay - moop_target) < TOLERANCE:
            break

        # Mark first iteration complete
        first_iteration_complete = True
        iter_deduct += 1

    # End of outer loop

    # If loop didn't run, ensure adjusted_deduct is set properly
    if iter_deduct == 0 and adjusted_deduct < 0:
        adjusted_deduct = plan.deductible

    # ========================================================================
    # STEP 14: CALCULATE PLAN PAYMENTS ACROSS ALL SPENDING RANGES
    # ========================================================================

    # Range 1: Below deductible (already calculated)
    plan_pay_below_deduct = accumulators.plan_pay

    # Range 2: Deductible to MOOP
    plan_pay_deduct_to_moop = 0.0

    moop_row = get_continuance_table_row(cont_table.up_to, adjusted_moop)
    deduct_row = get_continuance_table_row(cont_table.up_to, adjusted_deduct)

    for service_code, service_data in cont_table.services.items():
        if service_data is not None and len(service_data) > 0:
            cost_at_moop = compute_row_value(service_data, moop_row)
            cost_at_deduct = compute_row_value(service_data, deduct_row)
            cost_in_range = cost_at_moop - cost_at_deduct

            # Get service-specific coinsurance
            service_coinsurance = plan.get_service_coinsurance(service_code)

            # Plan pays (1 - coinsurance) of costs in this range
            plan_pay_deduct_to_moop += cost_in_range * (1 - service_coinsurance)

    # Range 3: Above MOOP (plan pays 100%)
    total_cost_at_moop = compute_row_value(cont_table.maxd, moop_row)
    plan_pay_above_moop = total_expected_cost - total_cost_at_moop

    # Total plan payment
    total_plan_pay = (plan_pay_below_deduct +
                     plan_pay_deduct_to_moop +
                     plan_pay_above_moop)

    # ========================================================================
    # STEP 15: CALCULATE FINAL AV
    # ========================================================================

    av = total_plan_pay / total_expected_cost if total_expected_cost > 0 else 0.0

    # Cap at 100%
    av = min(av, 1.0)

    # Determine metal tier
    calculated_tier = determine_metal_tier(av)

    # Calculate performance metrics
    calc_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    avg_inner_iterations = total_iter_coins / num_inner_loops if num_inner_loops > 0 else 0

    # Create result object
    return AVResult(
        av=av,
        av_percent=av * 100,
        metal_tier=calculated_tier,
        total_plan_payment=total_plan_pay,
        total_allowed_cost=total_expected_cost,
        plan_pay_below_deduct=plan_pay_below_deduct,
        plan_pay_deduct_to_moop=plan_pay_deduct_to_moop,
        plan_pay_above_moop=plan_pay_above_moop,
        adjusted_deductible=adjusted_deduct,
        adjusted_moop=adjusted_moop,
        iterations_outer=iter_deduct,
        iterations_inner=int(avg_inner_iterations),
        calculation_time=calc_time,
        warnings=warnings,
    )


def calculate_av(plan_params: dict) -> dict:
    """
    Main entry point for AV calculation.

    Simplified interface that accepts a dictionary of plan parameters
    and returns calculated AV with breakdown.

    Args:
        plan_params: Dictionary with plan parameters:
            - deductible: float (required)
            - moop: float (required)
            - coinsurance: float (required, 0.0 to 1.0)
            - metal_tier: str (optional, default 'Silver')
            - service_params: dict (optional, service-specific overrides)
            - hsa_contribution: float (optional, default 0.0)

    Returns:
        Dictionary with AV result and breakdown

    Example:
        >>> result = calculate_av({
        ...     'deductible': 4000,
        ...     'moop': 9100,
        ...     'coinsurance': 0.20,
        ...     'metal_tier': 'Silver',
        ...     'service_params': {
        ...         'PC': {'copay': 45, 'subject_to_deductible': False}
        ...     }
        ... })
        >>> print(f"AV: {result['av_percent']}%")
    """
    # Create PlanDesign object from parameters
    plan = PlanDesign(
        deductible=plan_params['deductible'],
        moop=plan_params['moop'],
        coinsurance=plan_params['coinsurance'],
        metal_tier=plan_params.get('metal_tier', 'Silver'),
        hsa_contribution=plan_params.get('hsa_contribution', 0.0),
        service_params=plan_params.get('service_params', {}),
    )

    # Load continuance table
    cont_table = get_continuance_table(plan.metal_tier, 'combined')

    # Calculate AV
    result = calculate_av_combined(plan, cont_table)

    # Return as dictionary
    return result.to_dict()
