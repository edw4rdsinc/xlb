"""
Pytest configuration and shared fixtures for AV Calculator tests.
"""

import json
import pytest
from pathlib import Path
from typing import Dict, Any
import numpy as np


# Test data paths
TEST_ROOT = Path(__file__).parent
PROJECT_ROOT = TEST_ROOT.parent.parent
TEST_CASES_DIR = PROJECT_ROOT.parent / "test-cases"
DATA_DIR = PROJECT_ROOT / "data"
CONTINUANCE_TABLES_DIR = DATA_DIR / "continuance-tables"


@pytest.fixture(scope="session")
def project_root():
    """Return project root directory."""
    return PROJECT_ROOT


@pytest.fixture(scope="session")
def test_cases_dir():
    """Return test cases directory."""
    return TEST_CASES_DIR


@pytest.fixture(scope="session")
def data_dir():
    """Return data directory."""
    return DATA_DIR


@pytest.fixture(scope="session")
def continuance_tables_dir():
    """Return continuance tables directory."""
    return CONTINUANCE_TABLES_DIR


@pytest.fixture(scope="session")
def test_plans_inventory():
    """Load all test plans from inventory."""
    inventory_path = TEST_CASES_DIR / "test-plans-inventory.json"
    with open(inventory_path, 'r') as f:
        data = json.load(f)
    return data['test_plans_inventory']['plans']


@pytest.fixture
def test_plan_by_id(test_plans_inventory):
    """Factory fixture to get test plan by ID."""
    def _get_plan(test_id: str) -> Dict[str, Any]:
        for plan in test_plans_inventory:
            if plan['id'] == test_id:
                return plan
        raise ValueError(f"Test plan {test_id} not found")
    return _get_plan


@pytest.fixture(scope="session")
def sli_sbc_4000_plan(test_plans_inventory):
    """Return the validated SLI-SBC-4000 test plan."""
    for plan in test_plans_inventory:
        if plan['id'] == 'TEST-001':
            return plan
    raise ValueError("TEST-001 (SLI-SBC-4000) not found in inventory")


@pytest.fixture(scope="session")
def all_continuance_tables():
    """Load all continuance tables into memory."""
    tables_path = CONTINUANCE_TABLES_DIR / "all-continuance-tables.json"
    with open(tables_path, 'r') as f:
        return json.load(f)


@pytest.fixture
def continuance_table_by_tier(all_continuance_tables):
    """Factory fixture to get continuance table by metal tier."""
    def _get_table(tier: str, table_type: str = 'combined') -> Dict[str, Any]:
        """
        Get continuance table by tier and type.

        Args:
            tier: Bronze, Silver, Gold, or Platinum
            table_type: combined, med, or rx

        Returns:
            Continuance table data
        """
        tier_lower = tier.lower()
        key = f"{tier_lower}_{table_type}"

        if key not in all_continuance_tables:
            raise ValueError(f"Table {key} not found")

        return all_continuance_tables[key]

    return _get_table


@pytest.fixture
def edge_cases_catalog():
    """Load edge cases catalog."""
    catalog_path = PROJECT_ROOT.parent / "edge-cases-catalog.md"
    with open(catalog_path, 'r') as f:
        return f.read()


@pytest.fixture
def sli_sbc_extracted_data():
    """Load extracted SLI-SBC-4000 data."""
    data_path = DATA_DIR / "SLI-SBC-4000-extracted-data.json"
    with open(data_path, 'r') as f:
        return json.load(f)


@pytest.fixture
def av_tolerance():
    """Return tolerance for AV comparisons."""
    return {
        'strict': 0.01,      # ±0.01% for validated plans
        'standard': 2.0,     # ±2% for research-based plans
        'loose': 5.0         # ±5% for approximations
    }


@pytest.fixture
def metal_tier_ranges():
    """Return metal tier AV ranges with de minimis variation."""
    return {
        'Bronze': {'min': 58.0, 'max': 62.0, 'target': 60.0},
        'Expanded Bronze': {'min': 62.0, 'max': 65.0, 'target': 63.5},
        'Silver': {'min': 68.0, 'max': 72.0, 'target': 70.0},
        'Gold': {'min': 78.0, 'max': 82.0, 'target': 80.0},
        'Platinum': {'min': 88.0, 'max': 92.0, 'target': 90.0}
    }


@pytest.fixture
def mock_calculator():
    """Return a mock calculator for testing without implementation."""
    class MockCalculator:
        def calculate_av(self, plan_params: Dict[str, Any]) -> Dict[str, Any]:
            """Mock implementation that returns expected values."""
            # For TEST-001, return the validated result
            if plan_params.get('test_id') == 'TEST-001':
                return {
                    'av_percentage': 72.27,
                    'av_decimal': 0.7227,
                    'metal_tier': 'Silver',
                    'is_valid': True
                }

            # For other plans, estimate based on deductible
            deductible = plan_params.get('deductible', {}).get('individual', 0)

            if deductible >= 7000:
                av = 60.0
                tier = 'Bronze'
            elif deductible >= 4000:
                av = 70.0
                tier = 'Silver'
            elif deductible >= 1000:
                av = 80.0
                tier = 'Gold'
            else:
                av = 90.0
                tier = 'Platinum'

            return {
                'av_percentage': av,
                'av_decimal': av / 100,
                'metal_tier': tier,
                'is_valid': True
            }

        def validate_plan(self, plan_params: Dict[str, Any]) -> Dict[str, Any]:
            """Mock validation."""
            errors = []
            warnings = []

            # Basic validation
            if plan_params.get('deductible', {}).get('individual', 0) > \
               plan_params.get('out_of_pocket_max', {}).get('individual', 999999):
                errors.append("Deductible cannot exceed MOOP")

            return {
                'is_valid': len(errors) == 0,
                'errors': errors,
                'warnings': warnings
            }

    return MockCalculator()


# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "critical: marks tests as critical (must pass)"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
    config.addinivalue_line(
        "markers", "edge_case: marks tests for edge cases"
    )
    config.addinivalue_line(
        "markers", "api: marks tests for API endpoints"
    )


def pytest_collection_modifyitems(config, items):
    """Modify test items during collection."""
    # Add markers based on test file location
    for item in items:
        if "test_integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)
        elif "test_edge_cases" in str(item.fspath):
            item.add_marker(pytest.mark.edge_case)
        elif "test_api" in str(item.fspath):
            item.add_marker(pytest.mark.api)
        else:
            item.add_marker(pytest.mark.unit)
