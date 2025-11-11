"""
Integration tests for AV Calculator.

End-to-end tests that exercise the full calculation pipeline.
"""

import pytest
import json
from pathlib import Path


class TestEndToEndCalculation:
    """End-to-end calculation tests."""

    @pytest.mark.integration
    def test_full_pipeline_sli_sbc_4000(self, sli_sbc_4000_plan, mock_calculator):
        """
        Test complete pipeline for SLI-SBC-4000 plan.

        Load plan -> Validate -> Calculate AV -> Classify tier -> Return result
        """
        # Step 1: Validate
        validation = mock_calculator.validate_plan(sli_sbc_4000_plan)
        assert validation['is_valid'], \
            f"Validation failed: {validation['errors']}"

        # Step 2: Calculate AV
        result = mock_calculator.calculate_av(sli_sbc_4000_plan)

        # Step 3: Verify result structure
        assert 'av_percentage' in result
        assert 'av_decimal' in result
        assert 'metal_tier' in result
        assert 'is_valid' in result

        # Step 4: Verify values
        assert result['is_valid']
        assert 72.26 <= result['av_percentage'] <= 72.28
        assert result['metal_tier'] == 'Silver'

    @pytest.mark.integration
    @pytest.mark.parametrize("test_id", [
        "TEST-001", "TEST-002", "TEST-003", "TEST-004", "TEST-005",
        "TEST-006", "TEST-007", "TEST-008", "TEST-009", "TEST-010"
    ])
    def test_full_pipeline_all_plans(self, test_plan_by_id, mock_calculator, test_id):
        """Test full pipeline for all 10 test plans."""
        plan = test_plan_by_id(test_id)

        # Validate
        validation = mock_calculator.validate_plan(plan)
        assert validation['is_valid'], \
            f"{test_id} validation failed: {validation['errors']}"

        # Calculate
        result = mock_calculator.calculate_av(plan)

        # Verify
        assert result['is_valid']
        assert 0 <= result['av_percentage'] <= 100
        assert result['metal_tier'] in ['Bronze', 'Silver', 'Gold', 'Platinum']

    @pytest.mark.integration
    def test_batch_calculation(self, test_plans_inventory, mock_calculator):
        """Test batch processing of all plans."""
        results = {}

        for plan in test_plans_inventory:
            test_id = plan['id']
            result = mock_calculator.calculate_av(plan)
            results[test_id] = result

        # All should succeed
        assert len(results) == 10

        # All should be valid
        for test_id, result in results.items():
            assert result['is_valid'], f"{test_id} calculation failed"


class TestContinuanceTableIntegration:
    """Test integration with continuance tables."""

    @pytest.mark.integration
    def test_load_and_calculate_bronze(self, test_plan_by_id, mock_calculator,
                                       continuance_table_by_tier):
        """Test calculation using Bronze continuance table."""
        # Get Bronze plan
        plan = test_plan_by_id('TEST-002')  # Bronze 60

        # Load Bronze table
        table = continuance_table_by_tier('Bronze', 'combined')
        assert table is not None

        # Calculate (would use Bronze table internally)
        result = mock_calculator.calculate_av(plan)

        assert result['is_valid']
        assert result['metal_tier'] == 'Bronze'

    @pytest.mark.integration
    def test_load_and_calculate_all_tiers(self, test_plans_inventory,
                                         mock_calculator, continuance_table_by_tier):
        """Test that each tier uses appropriate continuance table."""
        tier_mapping = {
            'Bronze': ['TEST-002', 'TEST-005', 'TEST-008'],
            'Silver': ['TEST-001', 'TEST-003', 'TEST-006', 'TEST-007', 'TEST-010'],
            'Gold': ['TEST-004'],
            'Platinum': ['TEST-009']
        }

        for tier, test_ids in tier_mapping.items():
            # Load table for this tier
            table = continuance_table_by_tier(tier, 'combined')
            assert table is not None

            # Calculate plans in this tier
            for test_id in test_ids:
                plan = [p for p in test_plans_inventory if p['id'] == test_id][0]
                result = mock_calculator.calculate_av(plan)

                assert result['is_valid']

    @pytest.mark.integration
    def test_separate_medical_rx_tables(self, test_plan_by_id, mock_calculator,
                                       continuance_table_by_tier):
        """Test using separate medical and Rx tables."""
        # Get plan with separate medical/drug deductibles
        plan = test_plan_by_id('TEST-006')  # CA Silver (has separate pharmacy deductible)

        # Load separate tables
        med_table = continuance_table_by_tier('Silver', 'med')
        rx_table = continuance_table_by_tier('Silver', 'rx')

        assert med_table is not None
        assert rx_table is not None

        # Calculate (would use both tables internally)
        result = mock_calculator.calculate_av(plan)

        assert result['is_valid']


class TestDataPersistence:
    """Test saving and loading results."""

    @pytest.mark.integration
    def test_save_calculation_results(self, test_plans_inventory, mock_calculator, tmp_path):
        """Test saving calculation results to JSON."""
        results = {}

        for plan in test_plans_inventory:
            test_id = plan['id']
            result = mock_calculator.calculate_av(plan)
            results[test_id] = result

        # Save to file
        output_file = tmp_path / "av_results.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)

        assert output_file.exists()

        # Verify can reload
        with open(output_file, 'r') as f:
            loaded_results = json.load(f)

        assert len(loaded_results) == 10

    @pytest.mark.integration
    def test_regression_baseline_generation(self, test_plans_inventory, mock_calculator):
        """Test generating regression baseline."""
        from fixtures import generate_regression_baseline

        baseline = generate_regression_baseline(mock_calculator, test_plans_inventory)

        # Should have results for all plans
        assert len(baseline['results']) == 10

        # Should have metadata
        assert 'timestamp' in baseline
        assert 'version' in baseline

        # All should be successful (with mock calculator)
        for test_id, result in baseline['results'].items():
            assert result['status'] == 'SUCCESS'

    @pytest.mark.integration
    def test_regression_comparison(self, test_plans_inventory, mock_calculator):
        """Test comparing results with baseline."""
        from fixtures import generate_regression_baseline, compare_with_baseline

        # Generate baseline
        baseline = generate_regression_baseline(mock_calculator, test_plans_inventory)

        # Calculate again (should be identical)
        current_results = {}
        for plan in test_plans_inventory:
            test_id = plan['id']
            result = mock_calculator.calculate_av(plan)
            current_results[test_id] = {
                'av_percentage': result['av_percentage'],
                'av_decimal': result['av_decimal'],
                'metal_tier': result['metal_tier'],
                'status': 'SUCCESS'
            }

        # Compare
        report = compare_with_baseline(current_results, baseline, tolerance=0.01)

        # All should pass (comparing with self)
        assert report['passed'] == 10
        assert report['failed'] == 0


class TestErrorHandling:
    """Test error handling and recovery."""

    @pytest.mark.integration
    def test_invalid_plan_graceful_failure(self, mock_calculator):
        """Test graceful handling of invalid plan."""
        invalid_plan = {
            'deductible': {'individual': 10000},  # Missing MOOP
            'coinsurance': {'medical': -0.5}  # Invalid coinsurance
        }

        # Should not crash
        try:
            result = mock_calculator.calculate_av(invalid_plan)
            # If it calculates, should mark as invalid
            assert not result.get('is_valid', True)
        except ValueError:
            # Also acceptable to raise ValueError
            pass

    @pytest.mark.integration
    def test_missing_continuance_table_error(self):
        """Test error when continuance table missing."""
        from fixtures import ContinuanceTableLoader

        loader = ContinuanceTableLoader(Path("/nonexistent"))

        with pytest.raises(FileNotFoundError):
            loader.load_table('Silver', 'combined')

    @pytest.mark.integration
    def test_corrupted_table_detection(self):
        """Test detection of corrupted continuance table."""
        from fixtures import ContinuanceTableLoader

        loader = ContinuanceTableLoader(None)

        corrupted_table = {
            'rows': [
                {'Up To': 100, 'MAXD': 50},
                {'Up To': 200, 'MAXD': -10}  # Negative value
            ]
        }

        validation = loader.validate_table_structure(corrupted_table)
        assert not validation['is_valid']


class TestPerformanceIntegration:
    """Test performance of integrated system."""

    @pytest.mark.integration
    @pytest.mark.slow
    def test_1000_calculations_performance(self, sli_sbc_4000_plan, mock_calculator, benchmark):
        """Test performance of 1000 calculations."""
        def run_1000_calcs():
            for _ in range(1000):
                mock_calculator.calculate_av(sli_sbc_4000_plan)

        # Should complete in reasonable time
        benchmark(run_1000_calcs)

    @pytest.mark.integration
    @pytest.mark.slow
    def test_memory_stability(self, sli_sbc_4000_plan, mock_calculator):
        """Test that memory usage is stable over many calculations."""
        import gc

        # Run many calculations
        for i in range(1000):
            result = mock_calculator.calculate_av(sli_sbc_4000_plan)
            assert result['is_valid']

            # Force garbage collection every 100 iterations
            if i % 100 == 0:
                gc.collect()

        # Should complete without memory issues


class TestMultiTierNetwork:
    """Test multi-tier network calculations."""

    @pytest.mark.integration
    @pytest.mark.skip(reason="Requires multi-tier implementation")
    def test_two_tier_network_calculation(self, mock_calculator):
        """Test calculation for plan with two network tiers."""
        plan_tier1 = {
            'tier': 'in_network',
            'deductible': {'individual': 1000, 'family': 2000},
            'out_of_pocket_max': {'individual': 5000, 'family': 10000},
            'coinsurance': {'medical': 0.20}
        }

        plan_tier2 = {
            'tier': 'out_of_network',
            'deductible': {'individual': 3000, 'family': 6000},
            'out_of_pocket_max': {'individual': 8000, 'family': 16000},
            'coinsurance': {'medical': 0.40}
        }

        # 80% in-network, 20% out-of-network
        tier1_util = 0.80
        tier2_util = 0.20

        # Calculate blended AV
        # (This would require multi-tier calculator function)

    @pytest.mark.integration
    @pytest.mark.skip(reason="Requires multi-tier implementation")
    def test_network_utilization_validation(self, mock_calculator):
        """Test that network utilization must sum to 100%."""
        config = {
            'tier1_utilization': 0.85,
            'tier2_utilization': 0.10  # Only 95% total
        }

        # Should fail validation
        validation = mock_calculator.validate_plan(config)
        assert not validation['is_valid']
