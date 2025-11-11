"""
Test fixtures and data helpers for AV Calculator tests.
"""

import json
import numpy as np
from pathlib import Path
from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class TestPlan:
    """Structured test plan data."""
    id: str
    name: str
    metal_tier: str
    published_av: float
    deductible_individual: float
    deductible_family: float
    moop_individual: float
    moop_family: float
    coinsurance: float
    copays: Dict[str, Any]
    prescription_drugs: Dict[str, Any]
    status: str
    validation_confidence: str

    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        """Create TestPlan from dictionary."""
        return cls(
            id=data['id'],
            name=data['plan_name'],
            metal_tier=data['metal_tier'],
            published_av=data['av_decimal'],
            deductible_individual=data['deductible']['individual'],
            deductible_family=data['deductible']['family'],
            moop_individual=data['out_of_pocket_max']['individual'],
            moop_family=data['out_of_pocket_max']['family'],
            coinsurance=data.get('coinsurance', {}).get('medical', 0.0),
            copays=data.get('copays', {}),
            prescription_drugs=data.get('prescription_drugs', {}),
            status=data.get('status', 'UNKNOWN'),
            validation_confidence=data.get('validation_confidence', 'UNKNOWN')
        )


class ContinuanceTableLoader:
    """Helper class to load and process continuance tables."""

    def __init__(self, tables_dir: Path):
        self.tables_dir = tables_dir
        self._cache = {}

    def load_table(self, tier: str, table_type: str = 'combined') -> Dict[str, Any]:
        """
        Load a specific continuance table.

        Args:
            tier: Bronze, Silver, Gold, or Platinum
            table_type: combined, med, or rx

        Returns:
            Table data dictionary
        """
        cache_key = f"{tier.lower()}_{table_type}"

        if cache_key in self._cache:
            return self._cache[cache_key]

        file_path = self.tables_dir / f"{cache_key}.json"

        if not file_path.exists():
            raise FileNotFoundError(f"Table file not found: {file_path}")

        with open(file_path, 'r') as f:
            data = json.load(f)

        self._cache[cache_key] = data
        return data

    def load_all_tables(self) -> Dict[str, Any]:
        """Load all continuance tables."""
        all_tables_path = self.tables_dir / "all-continuance-tables.json"

        if all_tables_path.exists():
            with open(all_tables_path, 'r') as f:
                return json.load(f)

        # If combined file doesn't exist, load individually
        tables = {}
        for tier in ['bronze', 'silver', 'gold', 'platinum']:
            for table_type in ['combined', 'med', 'rx']:
                key = f"{tier}_{table_type}"
                try:
                    tables[key] = self.load_table(tier, table_type)
                except FileNotFoundError:
                    pass

        return tables

    def validate_table_structure(self, table: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate continuance table structure and data integrity.

        Args:
            table: Table data to validate

        Returns:
            Validation result dictionary
        """
        errors = []
        warnings = []

        # Check required fields
        if 'rows' not in table:
            errors.append("Missing 'rows' field")
            return {'is_valid': False, 'errors': errors, 'warnings': warnings}

        rows = table['rows']

        # Check row count (should be 166)
        if len(rows) != 166:
            warnings.append(f"Expected 166 rows, got {len(rows)}")

        # Check column structure
        if len(rows) > 0:
            first_row = rows[0]
            required_columns = ['Up To', 'MAXD']

            for col in required_columns:
                if col not in first_row:
                    errors.append(f"Missing required column: {col}")

        # Check percentages sum to ~1.0 (if percentage column exists)
        if 'percentage' in rows[0] if len(rows) > 0 else False:
            total_pct = sum(row.get('percentage', 0) for row in rows)
            if abs(total_pct - 1.0) > 0.001:
                errors.append(f"Percentages sum to {total_pct}, expected 1.0")

        # Check for negative values
        for i, row in enumerate(rows):
            if 'MAXD' in row and row['MAXD'] < 0:
                errors.append(f"Negative MAXD value at row {i}: {row['MAXD']}")

        # Check monotonicity (MAXD should increase)
        prev_maxd = 0
        for i, row in enumerate(rows):
            if 'MAXD' in row:
                if row['MAXD'] < prev_maxd:
                    errors.append(f"Non-monotonic MAXD at row {i}: {row['MAXD']} < {prev_maxd}")
                prev_maxd = row['MAXD']

        return {
            'is_valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }


class TestDataBuilder:
    """Helper to build test data for various scenarios."""

    @staticmethod
    def create_minimal_plan(deductible: float = 1000, moop: float = 5000) -> Dict[str, Any]:
        """Create minimal valid plan parameters."""
        return {
            'deductible': {
                'individual': deductible,
                'family': deductible * 2,
                'type': 'combined'
            },
            'out_of_pocket_max': {
                'individual': moop,
                'family': moop * 2
            },
            'coinsurance': {
                'medical': 0.20
            },
            'copays': {
                'primary_care': 30,
                'specialist': 60,
                'emergency_room': 300,
                'preventive_care': 0
            },
            'prescription_drugs': {
                'generic': 10,
                'preferred_brand': 50,
                'non_preferred_brand': 100,
                'specialty': 200
            }
        }

    @staticmethod
    def create_hdhp_plan(deductible: float = 7000) -> Dict[str, Any]:
        """Create HDHP plan parameters."""
        return {
            'deductible': {
                'individual': deductible,
                'family': deductible * 2,
                'type': 'combined'
            },
            'out_of_pocket_max': {
                'individual': deductible,  # HDHP: deductible = MOOP
                'family': deductible * 2
            },
            'coinsurance': {
                'medical': 0.0  # HDHP: 100% coverage after deductible
            },
            'copays': {
                'preventive_care': 0
                # All other services subject to deductible
            },
            'hsa_eligible': True
        }

    @staticmethod
    def create_zero_deductible_plan() -> Dict[str, Any]:
        """Create plan with $0 deductible."""
        return {
            'deductible': {
                'individual': 0,
                'family': 0,
                'type': 'combined'
            },
            'out_of_pocket_max': {
                'individual': 5000,
                'family': 10000
            },
            'coinsurance': {
                'medical': 0.10
            },
            'copays': {
                'primary_care': 20,
                'specialist': 40,
                'emergency_room': 200,
                'preventive_care': 0
            }
        }

    @staticmethod
    def create_separate_deductible_plan() -> Dict[str, Any]:
        """Create plan with separate medical and drug deductibles."""
        return {
            'deductible': {
                'individual_medical': 4000,
                'individual_drug': 0,
                'family_medical': 8000,
                'family_drug': 0,
                'type': 'separate'
            },
            'out_of_pocket_max': {
                'individual': 8000,
                'family': 16000
            },
            'coinsurance': {
                'medical': 0.20
            },
            'copays': {
                'primary_care': 45,
                'specialist': 75
            },
            'prescription_drugs': {
                'generic': 10,
                'preferred_brand': 50
            }
        }


def load_test_case(test_id: str, test_cases_dir: Path) -> Dict[str, Any]:
    """
    Load a specific test case by ID.

    Args:
        test_id: Test case ID (e.g., 'TEST-001')
        test_cases_dir: Path to test cases directory

    Returns:
        Test case data
    """
    inventory_path = test_cases_dir / "test-plans-inventory.json"

    with open(inventory_path, 'r') as f:
        data = json.load(f)

    plans = data['test_plans_inventory']['plans']

    for plan in plans:
        if plan['id'] == test_id:
            return plan

    raise ValueError(f"Test case {test_id} not found")


def generate_regression_baseline(calculator, test_plans: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate regression baseline results for all test plans.

    Args:
        calculator: Calculator instance
        test_plans: List of test plan dictionaries

    Returns:
        Baseline results
    """
    baseline = {
        'timestamp': '2025-11-07T00:00:00Z',
        'version': '1.0.0',
        'results': {}
    }

    for plan in test_plans:
        test_id = plan['id']
        try:
            result = calculator.calculate_av(plan)
            baseline['results'][test_id] = {
                'av_percentage': result['av_percentage'],
                'av_decimal': result['av_decimal'],
                'metal_tier': result['metal_tier'],
                'status': 'SUCCESS'
            }
        except Exception as e:
            baseline['results'][test_id] = {
                'status': 'FAILED',
                'error': str(e)
            }

    return baseline


def compare_with_baseline(current_results: Dict[str, Any],
                         baseline: Dict[str, Any],
                         tolerance: float = 0.01) -> Dict[str, Any]:
    """
    Compare current test results with baseline.

    Args:
        current_results: Current test results
        baseline: Baseline results
        tolerance: Acceptable difference in AV percentage

    Returns:
        Comparison report
    """
    report = {
        'passed': 0,
        'failed': 0,
        'new': 0,
        'differences': []
    }

    for test_id, current in current_results.items():
        if test_id not in baseline['results']:
            report['new'] += 1
            report['differences'].append({
                'test_id': test_id,
                'type': 'NEW',
                'current': current
            })
            continue

        baseline_result = baseline['results'][test_id]

        if current['status'] != baseline_result['status']:
            report['failed'] += 1
            report['differences'].append({
                'test_id': test_id,
                'type': 'STATUS_CHANGE',
                'current_status': current['status'],
                'baseline_status': baseline_result['status']
            })
            continue

        if current['status'] == 'SUCCESS':
            av_diff = abs(current['av_percentage'] - baseline_result['av_percentage'])

            if av_diff > tolerance:
                report['failed'] += 1
                report['differences'].append({
                    'test_id': test_id,
                    'type': 'AV_DIFFERENCE',
                    'current_av': current['av_percentage'],
                    'baseline_av': baseline_result['av_percentage'],
                    'difference': av_diff
                })
            else:
                report['passed'] += 1

    return report
