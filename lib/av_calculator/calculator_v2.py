"""
AV Calculator V2 - Complete rewrite based on VBA implementation.

This implements the CMS 2026 AV Calculator algorithm with proper convergence
based on direct mapping from the VBA code.
"""

import math
import json
import warnings
from dataclasses import dataclass, field
from typing import Optional, Dict, List, Tuple
import time

from .models import PlanDesign, ContinuanceTable, AVResult, Accumulators, TableRow
from .continuance import get_continuance_table
from .utils import (
    get_continuance_table_row,
    compute_row_value,
    determine_metal_tier,
)


# ============================================================================
# CONFIGURATION
# ============================================================================

# Convergence parameters (from VBA)
MAX_ITERATIONS = 500  # Higher than VBA's 200 for accuracy
TOLERANCE = 0.001     # Tighter than VBA's 0.01 for accuracy
TUNING_PARAMETER = 5.0  # Exponential smoothing parameter from VBA


# ============================================================================
# SERVICE CONFIGURATION
# ============================================================================

@dataclass
class ServiceConfig:
    """Configuration for a single service type.

    Maps to VBA's service arrays:
    - CAD_ARR: Copay After Deductible
    - STD_ARR: Subject To Deductible
    - STC_ARR: Subject To Coinsurance
    """
    code: str  # Service code: 'PC', 'SP', 'ER', etc.
    copay: float = 0.0
    coinsurance: float = 0.2  # Default 20%
    copay_after_deductible: bool = False  # CAD flag
    subject_to_deductible: bool = True    # STD flag
    subject_to_coinsurance: bool = True   # STC flag

    def process_below_deductible(self, cost: float, freq: float) -> Tuple[float, float, float]:
        """Process service cost-sharing below deductible.

        Implements VBA ProcessServiceCostShare logic (lines 2603-2655).

        Args:
            cost: Total cost at this spending level
            freq: Frequency of service at this spending level

        Returns:
            Tuple of (plan_pay, beneficiary_pay_to_deduct, total_pay)
        """
        total_pay = cost

        # VBA lines 2625-2649
        if not self.copay_after_deductible:  # CAD = 0
            if not self.subject_to_deductible:  # STD = 0
                # Service not subject to deductible - plan pays cost above copay
                # VBA lines 2630-2632
                copay_amount = min(cost, freq * self.copay)
                plan_pay = max(0, cost - copay_amount)
                bene_to_deduct = 0  # Copay doesn't count toward deductible
            else:  # STD = 1
                # Service subject to deductible - copays don't satisfy deductible
                # VBA lines 2638-2640
                copay_amount = min(cost, freq * self.copay)
                plan_pay = 0
                bene_to_deduct = max(0, cost - copay_amount)  # Only non-copay portion counts
        else:  # CAD = 1
            # Copay only applies after deductible - enrollee pays full cost
            # VBA lines 2645-2647
            plan_pay = 0
            bene_to_deduct = cost

        return plan_pay, bene_to_deduct, total_pay

    def process_coinsurance_range(self, cost_in_range: float, freq_in_range: float) -> Tuple[float, float]:
        """Process service cost-sharing in coinsurance range (between deductible and MOOP).

        Args:
            cost_in_range: Cost in the coinsurance range
            freq_in_range: Frequency in the coinsurance range

        Returns:
            Tuple of (plan_pay, beneficiary_pay)
        """
        if not self.subject_to_coinsurance:
            # No coinsurance - use copay only
            copay_amount = min(cost_in_range, freq_in_range * self.copay)
            plan_pay = max(0, cost_in_range - copay_amount)
            bene_pay = copay_amount
        else:
            # Apply coinsurance
            if self.copay > 0 and not self.copay_after_deductible:
                # Copay applies in coinsurance range
                copay_amount = min(cost_in_range, freq_in_range * self.copay)
                plan_pay = max(0, cost_in_range - copay_amount)
                bene_pay = copay_amount
            else:
                # Pure coinsurance
                bene_pay = cost_in_range * self.coinsurance
                plan_pay = cost_in_range * (1 - self.coinsurance)

        return plan_pay, bene_pay


# ============================================================================
# CONVERGENCE TRACKER
# ============================================================================

@dataclass
class ConvergenceTracker:
    """Tracks and logs convergence behavior for debugging."""

    verbose: bool = False
    trace_file: Optional[str] = None
    iterations: List[Dict] = field(default_factory=list)

    def log_outer_iteration(self, iter_num: int, data: Dict):
        """Log outer loop state."""
        entry = {
            'outer_iter': iter_num,
            'deduct_target': data.get('deduct_target', 0),
            'adjusted_deduct': data.get('adjusted_deduct', 0),
            'adjusted_moop': data.get('adjusted_moop', 0),
            'total_beneficiary_pay': data.get('total_beneficiary_pay', 0),
            'moop_target': data.get('moop_target', 0),
            'convergence_gap': abs(data.get('total_beneficiary_pay', 0) - data.get('moop_target', 0)),
            'inner_iterations': data.get('inner_iterations', 0),
        }
        self.iterations.append(entry)

        if self.verbose:
            print(f"\n=== Outer Iteration {iter_num} ===")
            print(f"  Deduct Target: ${entry['deduct_target']:,.2f}")
            print(f"  Adjusted Deduct: ${entry['adjusted_deduct']:,.2f}")
            print(f"  Adjusted MOOP: ${entry['adjusted_moop']:,.2f}")
            print(f"  Total Bene Pay: ${entry['total_beneficiary_pay']:,.2f}")
            print(f"  MOOP Target: ${entry['moop_target']:,.2f}")
            print(f"  Convergence Gap: ${entry['convergence_gap']:,.2f}")
            print(f"  Inner Iterations: {entry['inner_iterations']}")

    def log_inner_iteration(self, outer_iter: int, inner_iter: int, data: Dict):
        """Log inner loop convergence."""
        if self.verbose and (inner_iter < 3 or inner_iter % 10 == 0):
            print(f"    Inner {inner_iter}: coins={data['coins']:.4f}, "
                  f"actual={data['actual_coins']:.4f}, "
                  f"gap={abs(data['coins'] - data['actual_coins']):.6f}")

    def save_trace(self):
        """Save full convergence trace to file."""
        if self.trace_file:
            with open(self.trace_file, 'w') as f:
                json.dump(self.iterations, f, indent=2)

    def get_summary(self) -> Dict:
        """Get convergence summary statistics."""
        if not self.iterations:
            return {}

        return {
            'total_outer_iterations': len(self.iterations),
            'total_inner_iterations': sum(it.get('inner_iterations', 0) for it in self.iterations),
            'final_convergence_gap': self.iterations[-1].get('convergence_gap', 0),
            'converged': self.iterations[-1].get('convergence_gap', float('inf')) < TOLERANCE,
        }


# ============================================================================
# SERVICE PROCESSING
# ============================================================================

def process_all_services_v2(
    services: Dict[str, ServiceConfig],
    cont_table: ContinuanceTable,
    deduct_row,  # TableRow object, not int
    accumulators: Accumulators
) -> None:
    """Process all services at deductible level.

    Implements the service processing loop from VBA lines 1818-2087.
    """
    # Reset accumulators for this iteration
    plan_pay_total = 0.0
    bene_pay_to_deduct_total = 0.0
    total_pay_total = 0.0

    for service_code, service_config in services.items():
        # Get service data from continuance table
        service_data = cont_table.services.get(service_code)
        if service_data is None or len(service_data) == 0:
            continue

        # Get cost at deductible level
        # Note: In current implementation, service_data is a single array of costs
        cost = compute_row_value(service_data, deduct_row)

        # For now, assume frequency of 1 for simplicity (this may need adjustment based on actual data)
        # In the VBA, frequency is a separate column, but in our current data structure,
        # we only have cost data
        freq = 1.0

        if cost <= 0:
            continue

        # Process service below deductible
        plan_pay, bene_to_deduct, total_pay = service_config.process_below_deductible(cost, freq)

        # Accumulate
        plan_pay_total += plan_pay
        bene_pay_to_deduct_total += bene_to_deduct
        total_pay_total += total_pay

    # Update accumulators
    accumulators.plan_pay = plan_pay_total
    accumulators.beneficiary_pay_to_deduct = bene_pay_to_deduct_total
    accumulators.total_pay = total_pay_total


def calculate_effective_coinsurance(
    services: Dict[str, ServiceConfig],
    cont_table: ContinuanceTable
) -> float:
    """Calculate effective coinsurance for services.

    Implements VBA's EffCoinsNum calculation (lines 2653).
    """
    total_cost = cont_table.total_expected_cost
    if total_cost <= 0:
        return 0.0

    weighted_coins = 0.0

    for service_code, service_config in services.items():
        service_data = cont_table.services.get(service_code)
        if service_data is None or len(service_data) == 0:
            continue

        # Get average cost (bottom row)
        bottom_row_idx = len(cont_table.up_to) - 1
        # Create TableRow object for bottom row
        bottom_row = TableRow(row_index=bottom_row_idx, interpolation_factor=0.0)
        avg_cost = compute_row_value(service_data, bottom_row)

        if avg_cost > 0 and service_config.subject_to_coinsurance:
            # Weight coinsurance by service cost
            weighted_coins += service_config.coinsurance * (avg_cost / total_cost)

    return weighted_coins


# ============================================================================
# MAIN CALCULATOR
# ============================================================================

def calculate_av_combined_v2(
    plan: PlanDesign,
    cont_table: ContinuanceTable,
    services: Optional[Dict[str, ServiceConfig]] = None,
    debug: bool = False,
    trace_file: Optional[str] = None
) -> AVResult:
    """Calculate Actuarial Value using properly mapped VBA algorithm.

    This implementation directly maps to the VBA code structure:
    - Outer loop: Lines 1797-2141 (deductible/MOOP adjustment)
    - Inner loop: Lines 1806-2103 (coinsurance convergence)
    - Service processing: Lines 1818-2087
    - MOOP adjustment: Lines 2105-2120
    - Deductible target adjustment: Lines 2122-2131
    """
    start_time = time.time()
    tracker = ConvergenceTracker(verbose=debug, trace_file=trace_file)

    # ========================================================================
    # STEP 1: INITIALIZE VARIABLES (VBA lines 1773-1796)
    # ========================================================================

    # Get total expected cost (VBA line 1777)
    total_expected_cost = cont_table.total_expected_cost

    # Initialize targets
    deduct_target = plan.deductible  # VBA line 1783
    moop_target = plan.moop

    # Critical initialization - must be -1 to force loop entry (VBA line 1780)
    adjusted_deduct = -1.0
    adjusted_moop = -1.0  # VBA line 1780: gADJ_MOOP = -1
    total_beneficiary_pay = -1.0  # VBA line 1784

    # Check if deductible equals MOOP (VBA line 1786)
    deduct_eq_moop = (plan.deductible == plan.moop)

    # Initialize services if not provided
    if services is None:
        services = create_default_services(plan)

    # Iteration counters
    iter_deduct = 0
    total_iter_coins = 0

    # Initialize accumulators
    accumulators = Accumulators()

    # ========================================================================
    # STEP 2: OUTER LOOP - DEDUCTIBLE/MOOP ADJUSTMENT (VBA lines 1797-2141)
    # ========================================================================

    # VBA line 1797: Do Until conditions
    while iter_deduct <= MAX_ITERATIONS:

        # Initialize for this outer iteration (VBA lines 1799-1803)
        moop_adjustment = 0.0
        coins = 1.0  # Start assuming 100% beneficiary payment
        prior_coins = 0.0
        actual_coins_achieved = -1.0
        total_beneficiary_pay = 0.0

        # Reset accumulators
        accumulators.reset()

        # ====================================================================
        # STEP 3: INNER LOOP - COINSURANCE CONVERGENCE (VBA lines 1806-2103)
        # ====================================================================

        iter_coins = 0

        while iter_coins <= MAX_ITERATIONS:

            # Check inner loop convergence (VBA line 1806)
            if abs(prior_coins - actual_coins_achieved) < TOLERANCE or \
               adjusted_deduct == 0 or coins == 0:
                break

            # Reset accumulators for this inner iteration (VBA lines 1808-1811)
            accumulators.reset()

            # Calculate adjusted deductible (VBA line 1813)
            if coins > 0:
                adjusted_deduct = deduct_target / coins
            else:
                adjusted_deduct = deduct_target

            # Find deductible row in continuance table (VBA line 1816)
            deduct_row = get_continuance_table_row(cont_table.up_to, adjusted_deduct)

            # Process all services at deductible level (VBA lines 1818-2087)
            process_all_services_v2(services, cont_table, deduct_row, accumulators)

            # Calculate achieved coinsurance rate (VBA lines 2088-2089)
            denominator = accumulators.total_pay
            if denominator > 0:
                actual_coins_achieved = accumulators.beneficiary_pay_to_deduct / denominator
            else:
                actual_coins_achieved = 0.0

            # Update coinsurance estimate (VBA lines 2090-2100)
            prior_coins = coins

            if coins == 1.0:  # First iteration
                # Use actual directly (VBA line 2091)
                coins = actual_coins_achieved
            else:
                # Damped update with exponential smoothing (VBA line 2100)
                coins = (prior_coins + actual_coins_achieved) / 2 * \
                        (1 - math.exp(-iter_coins / TUNING_PARAMETER))

            # Log inner iteration
            tracker.log_inner_iteration(iter_deduct, iter_coins, {
                'coins': coins,
                'actual_coins': actual_coins_achieved,
            })

            iter_coins += 1

        # End of inner loop
        total_iter_coins += iter_coins

        # ====================================================================
        # STEP 4: CALCULATE MOOP ADJUSTMENT (VBA lines 2105-2120)
        # ====================================================================

        if adjusted_deduct > 0 and accumulators.total_pay > 0:
            # Calculate effective coinsurance to MOOP (VBA line 2106)
            eff_coins_to_moop = 1 - (accumulators.plan_pay / accumulators.total_pay) - \
                               (accumulators.beneficiary_pay_to_deduct / accumulators.total_pay)
            eff_coins_to_moop = round(eff_coins_to_moop, 5)  # VBA line 2107

            # MOOP adjustment (VBA lines 2112-2114)
            moop_adjustment = adjusted_deduct * eff_coins_to_moop
            adjusted_moop = moop_target - moop_adjustment
        else:
            eff_coins_to_moop = 0
            moop_adjustment = 0
            adjusted_moop = moop_target

        # Calculate total beneficiary payment (VBA lines 2116-2120)
        if accumulators.total_pay == 0:
            total_beneficiary_pay = 0
        else:
            total_beneficiary_pay = adjusted_deduct * (1 - accumulators.plan_pay / accumulators.total_pay)

        # ====================================================================
        # STEP 5: ADJUST DEDUCTIBLE TARGET IF NEEDED (VBA lines 2122-2131)
        # ====================================================================

        # Log outer iteration before adjustment
        tracker.log_outer_iteration(iter_deduct, {
            'deduct_target': deduct_target,
            'adjusted_deduct': adjusted_deduct,
            'adjusted_moop': adjusted_moop,
            'total_beneficiary_pay': total_beneficiary_pay,
            'moop_target': moop_target,
            'inner_iterations': iter_coins,
        })

        # Check convergence BEFORE adjustment
        # If we've converged, no need to adjust further
        if abs(total_beneficiary_pay - moop_target) < TOLERANCE:
            iter_deduct += 1
            break

        # VBA line 2122: Check if adjustment needed
        # The key insight: once deduct_eq_moop is True, we always adjust
        # Also, if beneficiary isn't paying enough, we need to adjust
        needs_adjustment = (total_beneficiary_pay > moop_target or
                          (adjusted_deduct > 0 and coins == 0) or
                          deduct_eq_moop or
                          total_beneficiary_pay < moop_target - TOLERANCE)

        if needs_adjustment:
            # Calculate adjustment percentage (VBA lines 2124-2126)
            change_pct = 1 + (moop_target - total_beneficiary_pay) / (2 * deduct_target)
            change_pct = max(0.25, min(2.0, change_pct))  # Constrain

            # Adjust deductible target (VBA line 2128)
            deduct_target = deduct_target * change_pct

            # Mark that deductible equals MOOP (VBA line 2129)
            deduct_eq_moop = True

        # Check other exit conditions
        if not deduct_eq_moop and deduct_target <= adjusted_moop:
            iter_deduct += 1
            break

        iter_deduct += 1

    # End of outer loop

    # ========================================================================
    # STEP 6: RECALCULATE PLAN PAYMENT (VBA lines 2147-2148)
    # ========================================================================

    # This critical step was missing in the original Python implementation!
    if accumulators.total_pay > 0:
        deduct_row = get_continuance_table_row(cont_table.up_to, adjusted_deduct)
        ded_maxd = compute_row_value(cont_table.maxd, deduct_row)
        accumulators.plan_pay = ded_maxd * accumulators.plan_pay / accumulators.total_pay
    else:
        accumulators.plan_pay = 0.0

    plan_pay_below_deduct = accumulators.plan_pay

    # ========================================================================
    # STEP 7: CALCULATE EFFECTIVE COINSURANCE (VBA lines 2153-2172)
    # ========================================================================

    if deduct_eq_moop:
        eff_coins = 1.0  # VBA line 2158
        troop = adjusted_deduct  # VBA line 2166
    else:
        # Calculate effective coinsurance across all services
        eff_coins = calculate_effective_coinsurance(services, cont_table)
        eff_coins = min(eff_coins, 1.0)  # VBA line 2160

        # Calculate true out-of-pocket to MOOP (VBA lines 2165-2172)
        if eff_coins == 1:
            troop = adjusted_deduct
        else:
            # VBA line 2171: Note uses inputted deductible, not adjusted
            troop = adjusted_deduct + (adjusted_moop - plan.deductible) / (1 - eff_coins)

    # ========================================================================
    # STEP 8: CALCULATE COINSURANCE RANGE (VBA CombinedMacro2_v2)
    # ========================================================================

    # Initialize warnings list early
    warnings_list = []

    plan_pay_deduct_to_moop = 0.0

    # Check for valid coinsurance range
    if adjusted_moop < plan.deductible:
        # This shouldn't happen in a valid plan design
        warnings_list.append(f"Adjusted MOOP ({adjusted_moop:.2f}) < deductible ({plan.deductible:.2f})")
        plan_pay_deduct_to_moop = 0.0
    elif not deduct_eq_moop and adjusted_moop > plan.deductible:
        # Calculate plan payments in coinsurance range
        # Use the original deductible spending level, not adjusted deductible
        moop_row = get_continuance_table_row(cont_table.up_to, troop)
        # For coinsurance range, we need to use the point where the original deductible is satisfied
        deduct_spending_level = plan.deductible  # Use original deductible amount for coinsurance range start
        deduct_row_for_coins = get_continuance_table_row(cont_table.up_to, deduct_spending_level)

        for service_code, service_config in services.items():
            service_data = cont_table.services.get(service_code)
            if service_data is None or len(service_data) == 0:
                continue

            # Get costs at MOOP and deductible levels
            cost_at_moop = compute_row_value(service_data, moop_row)
            cost_at_deduct = compute_row_value(service_data, deduct_row_for_coins)

            # Simplified frequency calculation - assume frequency is proportional to cost
            # In actual VBA, frequency is a separate column, but we don't have that data structure yet
            freq_in_range = 1.0

            cost_in_range = cost_at_moop - cost_at_deduct

            if cost_in_range > 0:
                plan_pay, _ = service_config.process_coinsurance_range(cost_in_range, freq_in_range)
                plan_pay_deduct_to_moop += plan_pay

    # ========================================================================
    # STEP 9: CALCULATE ABOVE MOOP (Plan pays 100%)
    # ========================================================================

    if deduct_eq_moop:
        total_cost_at_moop = compute_row_value(cont_table.maxd, deduct_row)
    else:
        moop_row = get_continuance_table_row(cont_table.up_to, troop)
        total_cost_at_moop = compute_row_value(cont_table.maxd, moop_row)

    plan_pay_above_moop = total_expected_cost - total_cost_at_moop

    # ========================================================================
    # STEP 10: CALCULATE FINAL AV
    # ========================================================================

    total_plan_pay = (plan_pay_below_deduct +
                     plan_pay_deduct_to_moop +
                     plan_pay_above_moop)

    av = total_plan_pay / total_expected_cost if total_expected_cost > 0 else 0.0
    av = min(av, 1.0)  # Cap at 100%

    # Save trace if requested
    tracker.save_trace()

    # Get convergence summary
    conv_summary = tracker.get_summary()

    # Calculate performance metrics
    calc_time = (time.time() - start_time) * 1000  # milliseconds

    # Create warnings if convergence failed
    warnings_list = []
    if not conv_summary.get('converged', False):
        warnings_list.append(f"Convergence not achieved. Final gap: {conv_summary.get('final_convergence_gap', 0):.6f}")
    if iter_deduct >= MAX_ITERATIONS:
        warnings_list.append(f"Outer loop hit max iterations ({MAX_ITERATIONS})")

    # This warning was added earlier in the coinsurance range check

    # Create result
    return AVResult(
        av=av,
        av_percent=av * 100,
        metal_tier=determine_metal_tier(av),
        total_plan_payment=total_plan_pay,
        total_allowed_cost=total_expected_cost,
        plan_pay_below_deduct=plan_pay_below_deduct,
        plan_pay_deduct_to_moop=plan_pay_deduct_to_moop,
        plan_pay_above_moop=plan_pay_above_moop,
        adjusted_deductible=adjusted_deduct,
        adjusted_moop=adjusted_moop,
        iterations_outer=conv_summary.get('total_outer_iterations', iter_deduct),
        iterations_inner=conv_summary.get('total_inner_iterations', total_iter_coins) // max(iter_deduct, 1),
        calculation_time=calc_time,
        warnings=warnings_list,
    )


def create_default_services(plan: PlanDesign) -> Dict[str, ServiceConfig]:
    """Create default service configurations based on plan design.

    This maps to the VBA service arrays and default configurations.
    """
    services = {}

    # Get base coinsurance from plan
    base_coins = plan.coinsurance

    # Define standard services with typical configurations
    # These should be customized based on actual plan design

    service_definitions = [
        # Medical services (copay, coinsurance, CAD, STD, STC)
        ('ER', 350, base_coins, False, True, True),      # Emergency Room - subject to deductible
        ('IP', 1500, base_coins, True, True, True),      # Inpatient - copay after deductible
        ('PC', 45, base_coins, False, True, True),       # Primary Care - subject to deductible
        ('SP', 75, base_coins, False, True, True),       # Specialist - subject to deductible
        ('PSY', 45, base_coins, False, True, True),      # Mental Health - subject to deductible
        ('IMG', 100, base_coins, False, True, True),     # Imaging - subject to deductible
        ('ST', 50, base_coins, False, True, True),       # Speech Therapy - subject to deductible
        ('OT', 50, base_coins, False, True, True),       # Occupational/Physical Therapy - subject to deductible
        ('PV', 0, 0.0, False, False, False),             # Preventive - ONLY service not subject to deductible
        ('LAB', 25, base_coins, False, True, True),      # Laboratory - subject to deductible
        ('XRAY', 50, base_coins, False, True, True),     # X-ray - subject to deductible
        ('OP', 500, base_coins, False, True, True),      # Outpatient - subject to deductible
        ('SNF', 300, base_coins, False, True, True),     # Skilled Nursing - subject to deductible

        # Drug services
        ('GENRX', 10, base_coins, False, True, True),    # Generic - subject to deductible
        ('PREFRX', 40, base_coins, False, True, True),   # Preferred Brand - subject to deductible
        ('NONPREFRX', 80, base_coins, False, True, True),      # Non-Preferred Brand - subject to deductible
        ('SPECRX', 200, base_coins, False, True, True),        # Specialty - subject to deductible
    ]

    # Override with plan-specific parameters
    for code, copay, coins, cad, std, stc in service_definitions:
        # Check if plan has specific overrides
        if code in plan.service_params:
            params = plan.service_params[code]
            services[code] = ServiceConfig(
                code=code,
                copay=params.get('copay', copay),
                coinsurance=params.get('coinsurance', coins),
                copay_after_deductible=params.get('copay_after_deductible', cad),
                subject_to_deductible=params.get('subject_to_deductible', std),
                subject_to_coinsurance=params.get('subject_to_coinsurance', stc),
            )
        else:
            services[code] = ServiceConfig(
                code=code,
                copay=copay,
                coinsurance=coins,
                copay_after_deductible=cad,
                subject_to_deductible=std,
                subject_to_coinsurance=stc,
            )

    return services


def calculate_av(plan_params: dict) -> dict:
    """Main entry point for AV calculation - V2.

    Args:
        plan_params: Dictionary with plan parameters:
            - deductible: float (required)
            - moop: float (required)
            - coinsurance: float (required, 0.0 to 1.0)
            - metal_tier: str (optional, default 'Silver')
            - service_params: dict (optional, service-specific overrides)
            - hsa_contribution: float (optional, default 0.0)
            - debug: bool (optional, enable debug output)
            - trace_file: str (optional, save convergence trace)

    Returns:
        Dictionary with AV result and breakdown
    """
    # Create PlanDesign object
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
    result = calculate_av_combined_v2(
        plan,
        cont_table,
        debug=plan_params.get('debug', False),
        trace_file=plan_params.get('trace_file', None)
    )

    # Return as dictionary
    return result.to_dict()