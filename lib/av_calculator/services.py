"""
Service cost-sharing processing.

Logic for calculating cost-sharing for individual service types.
"""

from .models import PlanDesign, TableRow, ContinuanceTable, Accumulators
from .utils import compute_row_value, deductible_adjustment, effective_coinsurance_numerator, calculate_frequency


def process_service_cost_share(
    service_code: str,
    service_data: list,
    plan: PlanDesign,
    table_row: TableRow,
    accumulators: Accumulators
) -> None:
    """
    Process cost-sharing for a single service type and update accumulators.

    This is the heart of the cost-sharing logic. It determines:
    - How much the enrollee pays
    - How much counts toward the deductible
    - How much the plan pays
    - Contributions to effective coinsurance

    Args:
        service_code: Service code (e.g., 'ER', 'PC', 'RXGEN')
        service_data: Service cost data array from continuance table
        plan: Plan design parameters
        table_row: Position in continuance table (deductible level)
        accumulators: Accumulator object to update

    Side Effects:
        Updates accumulators in place:
        - beneficiary_pay_to_deduct
        - plan_pay
        - total_pay
        - eff_coins_numerator
    """
    # Get cost at this spending level
    cost = compute_row_value(service_data, table_row)
    if cost == 0:
        return  # No spending for this service

    # Get frequency (instances of service)
    frequency = calculate_frequency(service_data, table_row)

    # Get service-specific parameters
    copay = plan.get_service_copay(service_code)
    coinsurance = plan.get_service_coinsurance(service_code)
    subject_to_deductible = plan.is_subject_to_deductible(service_code)
    subject_to_coinsurance = plan.is_subject_to_coinsurance(service_code)

    # Calculate adjustment factors
    deduct_adj = deductible_adjustment(cost, frequency, copay, subject_to_deductible)
    eff_coins_num = effective_coinsurance_numerator(
        cost, frequency, copay, coinsurance, subject_to_coinsurance
    )

    # Determine cost-sharing based on flags and copay
    if not subject_to_deductible and copay > 0:
        # NOT subject to deductible, HAS copay
        # Example: Preventive care with copay, or PC visit not subject to deductible
        enrollee_pays = frequency * copay
        plan_pays = cost - enrollee_pays
        deduct_credit = 0.0

    elif not subject_to_deductible and copay == 0:
        # NOT subject to deductible, NO copay (100% covered)
        # Example: Preventive care (ACA-mandated $0 cost)
        enrollee_pays = 0.0
        plan_pays = cost
        deduct_credit = 0.0

    elif subject_to_deductible and copay > 0:
        # Subject to deductible WITH copay
        # Enrollee pays full cost, but only portion counts toward deductible
        enrollee_pays = cost
        plan_pays = 0.0
        deduct_credit = cost - min(cost, frequency * copay)

    elif subject_to_deductible and copay == 0:
        # Subject to deductible, NO copay
        # Enrollee pays full cost, all counts toward deductible
        enrollee_pays = cost
        plan_pays = 0.0
        deduct_credit = cost

    else:
        # Shouldn't reach here
        raise ValueError(f"Invalid cost-sharing configuration for service {service_code}")

    # Update accumulators
    accumulators.beneficiary_pay_to_deduct += deduct_credit
    accumulators.plan_pay += plan_pays
    accumulators.total_pay += cost
    accumulators.eff_coins_numerator += eff_coins_num


def process_all_services(
    cont_table: ContinuanceTable,
    plan: PlanDesign,
    deduct_row: TableRow,
    accumulators: Accumulators
) -> None:
    """
    Process all service types at the deductible spending level.

    Iterates through all available services in the continuance table
    and calculates cost-sharing for each.

    Args:
        cont_table: Continuance table with service distributions
        plan: Plan design with all cost-sharing parameters
        deduct_row: Row in table corresponding to adjusted deductible
        accumulators: Accumulator object to update
    """
    # Process each service that exists in the table
    for service_code, service_data in cont_table.services.items():
        if service_data is not None and len(service_data) > 0:
            process_service_cost_share(
                service_code=service_code,
                service_data=service_data,
                plan=plan,
                table_row=deduct_row,
                accumulators=accumulators
            )
