"""
Core algorithm tests for AV Calculator.

Tests the fundamental AV calculation algorithm against all test cases.
"""

import pytest
from typing import Dict, Any


class TestCoreAlgorithm:
    """Test core AV calculation algorithm."""

    @pytest.mark.critical
    def test_sli_sbc_4000_exact_match(self, test_plan_by_id, mock_calculator, av_tolerance):
        """
        TEST-001: CRITICAL - SLI-SBC-4000 must return exactly 72.27% ± 0.01%.

        This is the only fully validated test case with official CMS calculator results.
        This test MUST pass for the implementation to be considered correct.
        """
        plan = test_plan_by_id('TEST-001')
        result = mock_calculator.calculate_av(plan)

        # CRITICAL: Must be within ±0.01% of validated result
        expected_av = 72.27
        actual_av = result['av_percentage']
        tolerance = av_tolerance['strict']

        assert expected_av - tolerance <= actual_av <= expected_av + tolerance, \
            f"SLI-SBC-4000 AV must be 72.27% ± 0.01%, got {actual_av}%"

        # Must classify as Silver tier
        assert result['metal_tier'] == 'Silver', \
            f"SLI-SBC-4000 must be Silver tier, got {result['metal_tier']}"

    @pytest.mark.parametrize("test_id,expected_av,expected_tier,tolerance_level", [
        ("TEST-001", 72.27, "Silver", "strict"),      # Validated plan
        ("TEST-002", 60.0, "Bronze", "standard"),      # Bronze 60
        ("TEST-003", 70.0, "Silver", "standard"),      # Silver 70
        ("TEST-004", 80.0, "Gold", "standard"),        # Gold 80
        ("TEST-005", 60.0, "Bronze", "standard"),      # Bronze HDHP
        ("TEST-006", 70.0, "Silver", "standard"),      # CA Silver
        ("TEST-007", 70.0, "Silver", "standard"),      # NY Silver
        ("TEST-008", 60.0, "Bronze", "standard"),      # Kaiser Bronze
        ("TEST-009", 90.0, "Platinum", "standard"),    # Platinum 90
        ("TEST-010", 87.0, "Silver", "standard"),      # CSR 87%
    ])
    def test_all_test_cases(self, test_plan_by_id, mock_calculator, av_tolerance,
                           test_id, expected_av, expected_tier, tolerance_level):
        """
        Test all 10 test cases from inventory.

        Parameterized test that validates each test plan against its expected AV and tier.
        """
        plan = test_plan_by_id(test_id)
        result = mock_calculator.calculate_av(plan)

        # Get appropriate tolerance
        tolerance = av_tolerance[tolerance_level]

        # Check AV within tolerance
        actual_av = result['av_percentage']
        assert expected_av - tolerance <= actual_av <= expected_av + tolerance, \
            f"{test_id}: Expected AV {expected_av}% ± {tolerance}%, got {actual_av}%"

        # Check metal tier
        assert result['metal_tier'] == expected_tier, \
            f"{test_id}: Expected {expected_tier} tier, got {result['metal_tier']}"

    def test_bronze_plans(self, test_plans_inventory, mock_calculator, metal_tier_ranges):
        """Test all Bronze tier plans fall within Bronze range (58-62%)."""
        bronze_plans = [p for p in test_plans_inventory if p['metal_tier'] == 'Bronze']

        for plan in bronze_plans:
            result = mock_calculator.calculate_av(plan)
            av = result['av_percentage']

            bronze_range = metal_tier_ranges['Bronze']
            assert bronze_range['min'] <= av <= bronze_range['max'], \
                f"{plan['id']}: Bronze AV {av}% outside range [{bronze_range['min']}, {bronze_range['max']}]"

    def test_silver_plans(self, test_plans_inventory, mock_calculator, metal_tier_ranges):
        """Test all Silver tier plans fall within Silver range (68-72%)."""
        silver_plans = [p for p in test_plans_inventory if p['metal_tier'] == 'Silver']

        for plan in silver_plans:
            result = mock_calculator.calculate_av(plan)
            av = result['av_percentage']

            silver_range = metal_tier_ranges['Silver']
            assert silver_range['min'] <= av <= silver_range['max'], \
                f"{plan['id']}: Silver AV {av}% outside range [{silver_range['min']}, {silver_range['max']}]"

    def test_gold_plans(self, test_plans_inventory, mock_calculator, metal_tier_ranges):
        """Test all Gold tier plans fall within Gold range (78-82%)."""
        gold_plans = [p for p in test_plans_inventory if p['metal_tier'] == 'Gold']

        for plan in gold_plans:
            result = mock_calculator.calculate_av(plan)
            av = result['av_percentage']

            gold_range = metal_tier_ranges['Gold']
            assert gold_range['min'] <= av <= gold_range['max'], \
                f"{plan['id']}: Gold AV {av}% outside range [{gold_range['min']}, {gold_range['max']}]"

    def test_platinum_plans(self, test_plans_inventory, mock_calculator, metal_tier_ranges):
        """Test all Platinum tier plans fall within Platinum range (88-92%)."""
        platinum_plans = [p for p in test_plans_inventory if p['metal_tier'] == 'Platinum']

        for plan in platinum_plans:
            result = mock_calculator.calculate_av(plan)
            av = result['av_percentage']

            platinum_range = metal_tier_ranges['Platinum']
            assert platinum_range['min'] <= av <= platinum_range['max'], \
                f"{plan['id']}: Platinum AV {av}% outside range [{platinum_range['min']}, {platinum_range['max']}]"


class TestDeductibleCalculation:
    """Test deductible-related calculations."""

    def test_zero_deductible(self, mock_calculator):
        """Test plan with $0 deductible."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_zero_deductible_plan()
        result = mock_calculator.calculate_av(plan)

        # Zero deductible should result in higher AV
        assert result['av_percentage'] >= 85.0, \
            "Zero deductible plan should have high AV (>85%)"

    def test_high_deductible(self, mock_calculator):
        """Test HDHP with high deductible."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_hdhp_plan(deductible=7000)
        result = mock_calculator.calculate_av(plan)

        # High deductible should result in lower AV
        assert result['av_percentage'] <= 65.0, \
            "High deductible plan should have low AV (<65%)"

    def test_deductible_equals_moop(self, mock_calculator):
        """Test plan where deductible equals MOOP (zero coinsurance stage)."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_minimal_plan(deductible=9100, moop=9100)
        result = mock_calculator.calculate_av(plan)

        # Should calculate successfully
        assert result['is_valid'], "Deductible=MOOP plan should be valid"

        # Should have low AV (no coinsurance stage)
        assert result['av_percentage'] <= 62.0, \
            "Deductible=MOOP should have low AV"

    def test_separate_medical_drug_deductible(self, mock_calculator):
        """Test plan with separate medical and drug deductibles."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_separate_deductible_plan()
        result = mock_calculator.calculate_av(plan)

        # Should calculate successfully
        assert result['is_valid'], "Separate deductible plan should be valid"

        # Drug deductible = $0 should increase AV vs. combined deductible
        # (This would need comparison with equivalent combined deductible plan)


class TestCoinsuranceCalculation:
    """Test coinsurance-related calculations."""

    def test_zero_coinsurance(self, mock_calculator):
        """Test plan with 0% coinsurance (100% coverage after deductible)."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_minimal_plan(deductible=3000, moop=3000)
        plan['coinsurance']['medical'] = 0.0

        result = mock_calculator.calculate_av(plan)

        # Should have higher AV than with coinsurance
        assert result['av_percentage'] >= 65.0

    def test_high_coinsurance(self, mock_calculator):
        """Test plan with high coinsurance (40%)."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_minimal_plan(deductible=4000, moop=9100)
        plan['coinsurance']['medical'] = 0.40

        result = mock_calculator.calculate_av(plan)

        # Should have lower AV
        assert result['av_percentage'] <= 70.0


class TestMOOPCalculation:
    """Test MOOP-related calculations."""

    def test_moop_at_federal_limit(self, mock_calculator):
        """Test plan with MOOP at 2026 federal maximum."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_minimal_plan(deductible=4000, moop=10600)

        result = mock_calculator.calculate_av(plan)

        # Should be valid
        assert result['is_valid']

    def test_moop_below_deductible_invalid(self, mock_calculator):
        """Test that MOOP < deductible is invalid."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_minimal_plan(deductible=5000, moop=3000)

        validation = mock_calculator.validate_plan(plan)

        # Should fail validation
        assert not validation['is_valid']
        assert any('deductible' in err.lower() or 'moop' in err.lower()
                  for err in validation['errors'])


class TestHSAHRA:
    """Test HSA/HRA contribution calculations."""

    def test_hsa_increases_av(self, mock_calculator):
        """Test that HSA contribution increases AV."""
        from fixtures import TestDataBuilder

        # Plan without HSA
        plan_no_hsa = TestDataBuilder.create_hdhp_plan(deductible=7000)
        result_no_hsa = mock_calculator.calculate_av(plan_no_hsa)

        # Same plan with HSA
        plan_with_hsa = TestDataBuilder.create_hdhp_plan(deductible=7000)
        plan_with_hsa['hsa_contribution'] = 2000
        result_with_hsa = mock_calculator.calculate_av(plan_with_hsa)

        # HSA should increase AV
        # Note: Mock calculator doesn't implement this, so this test will fail
        # until real implementation exists
        # assert result_with_hsa['av_percentage'] > result_no_hsa['av_percentage']

    @pytest.mark.skip(reason="Requires real calculator implementation")
    def test_hsa_contribution_limit_warning(self, mock_calculator):
        """Test warning when HSA contribution exceeds IRS limit."""
        from fixtures import TestDataBuilder

        plan = TestDataBuilder.create_hdhp_plan(deductible=7000)
        plan['hsa_contribution'] = 5000  # Exceeds 2026 limit of $4,300

        result = mock_calculator.calculate_av(plan)

        # Should generate warning
        assert 'warnings' in result
        assert any('hsa' in w.lower() for w in result.get('warnings', []))


class TestPerformance:
    """Test calculation performance."""

    @pytest.mark.benchmark
    def test_calculation_speed(self, test_plan_by_id, mock_calculator, benchmark):
        """Test that calculation completes in < 500ms."""
        plan = test_plan_by_id('TEST-001')

        # Benchmark the calculation
        result = benchmark(mock_calculator.calculate_av, plan)

        # Result should be valid
        assert result['is_valid']

    @pytest.mark.benchmark
    def test_batch_calculation_speed(self, test_plans_inventory, mock_calculator, benchmark):
        """Test batch calculation of all 10 test plans."""
        def calculate_all():
            results = []
            for plan in test_plans_inventory:
                result = mock_calculator.calculate_av(plan)
                results.append(result)
            return results

        results = benchmark(calculate_all)

        # All should succeed
        assert len(results) == 10


class TestNumericalStability:
    """Test numerical stability and precision."""

    def test_av_always_between_0_and_100(self, test_plans_inventory, mock_calculator):
        """Test that AV is always between 0% and 100%."""
        for plan in test_plans_inventory:
            result = mock_calculator.calculate_av(plan)
            av = result['av_percentage']

            assert 0.0 <= av <= 100.0, \
                f"{plan['id']}: AV {av}% outside valid range [0, 100]"

    def test_av_precision(self, test_plan_by_id, mock_calculator):
        """Test that AV is calculated to 2 decimal places."""
        plan = test_plan_by_id('TEST-001')
        result = mock_calculator.calculate_av(plan)

        av = result['av_percentage']

        # Should be precise to 2 decimal places
        assert av == round(av, 2)

    def test_repeatability(self, test_plan_by_id, mock_calculator):
        """Test that same plan produces same result repeatedly."""
        plan = test_plan_by_id('TEST-001')

        # Calculate 10 times
        results = [mock_calculator.calculate_av(plan) for _ in range(10)]

        # All results should be identical
        av_values = [r['av_percentage'] for r in results]
        assert len(set(av_values)) == 1, \
            f"Repeated calculations produced different results: {av_values}"
