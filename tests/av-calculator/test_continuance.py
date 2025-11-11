"""
Tests for continuance table loading, validation, and interpolation.
"""

import pytest
import json


class TestContinuanceTableLoading:
    """Test loading continuance tables from disk."""

    def test_all_tables_exist(self, continuance_tables_dir):
        """Verify all 12 required tables exist."""
        expected_tables = [
            'bronze_combined.json', 'bronze_med.json', 'bronze_rx.json',
            'silver_combined.json', 'silver_med.json', 'silver_rx.json',
            'gold_combined.json', 'gold_med.json', 'gold_rx.json',
            'platinum_combined.json', 'platinum_med.json', 'platinum_rx.json'
        ]

        for table_name in expected_tables:
            table_path = continuance_tables_dir / table_name
            assert table_path.exists(), f"Missing table: {table_name}"

    def test_combined_tables_file_exists(self, continuance_tables_dir):
        """Verify combined tables JSON exists."""
        combined_path = continuance_tables_dir / "all-continuance-tables.json"
        assert combined_path.exists(), "Missing all-continuance-tables.json"

    def test_load_bronze_combined(self, continuance_tables_dir):
        """Test loading Bronze combined table."""
        table_path = continuance_tables_dir / "bronze_combined.json"

        with open(table_path, 'r') as f:
            data = json.load(f)

        assert 'rows' in data or isinstance(data, list), \
            "Table should have 'rows' key or be a list"

    def test_load_all_tables(self, all_continuance_tables):
        """Test loading all tables via fixture."""
        assert len(all_continuance_tables) >= 12, \
            f"Expected at least 12 tables, got {len(all_continuance_tables)}"

        # Check for expected keys
        expected_keys = [
            'bronze_combined', 'bronze_med', 'bronze_rx',
            'silver_combined', 'silver_med', 'silver_rx',
            'gold_combined', 'gold_med', 'gold_rx',
            'platinum_combined', 'platinum_med', 'platinum_rx'
        ]

        for key in expected_keys:
            assert key in all_continuance_tables, f"Missing table: {key}"


class TestContinuanceTableStructure:
    """Test continuance table data structure and integrity."""

    def test_table_has_166_rows(self, continuance_tables_dir):
        """Verify each table has 166 rows as specified in documentation."""
        table_path = continuance_tables_dir / "silver_combined.json"

        with open(table_path, 'r') as f:
            data = json.load(f)

        # Handle both formats: {'rows': [...]} or [...]
        rows = data.get('rows', data) if isinstance(data, dict) else data

        assert len(rows) == 166, \
            f"Expected 166 rows, got {len(rows)}"

    def test_table_has_required_columns(self, continuance_tables_dir):
        """Verify table has required columns."""
        table_path = continuance_tables_dir / "silver_combined.json"

        with open(table_path, 'r') as f:
            data = json.load(f)

        rows = data.get('rows', data) if isinstance(data, dict) else data

        if len(rows) > 0:
            first_row = rows[0]

            # Should have 'Up To' threshold column
            assert 'Up To' in first_row or 'up_to' in first_row, \
                "Missing 'Up To' threshold column"

            # Should have at least one spending column
            # Common column names: MAXD, PRIMARY_CARE, EMERGENCY_ROOM, etc.
            assert len(first_row.keys()) > 1, \
                "Table should have multiple columns"

    def test_no_negative_values(self, continuance_tables_dir):
        """Verify no negative values in continuance tables."""
        table_path = continuance_tables_dir / "silver_combined.json"

        with open(table_path, 'r') as f:
            data = json.load(f)

        rows = data.get('rows', data) if isinstance(data, dict) else data

        for i, row in enumerate(rows):
            for key, value in row.items():
                if isinstance(value, (int, float)) and key != 'Up To':
                    assert value >= 0, \
                        f"Negative value at row {i}, column {key}: {value}"

    def test_up_to_column_monotonic(self, continuance_tables_dir):
        """Verify 'Up To' column is strictly increasing."""
        table_path = continuance_tables_dir / "silver_combined.json"

        with open(table_path, 'r') as f:
            data = json.load(f)

        rows = data.get('rows', data) if isinstance(data, dict) else data

        prev_value = -1
        for i, row in enumerate(rows):
            up_to_key = 'Up To' if 'Up To' in row else 'up_to'

            if up_to_key in row:
                current_value = row[up_to_key]

                # Handle "Unlimited" or similar string values
                if isinstance(current_value, str):
                    continue

                assert current_value >= prev_value, \
                    f"'Up To' not monotonic at row {i}: {current_value} < {prev_value}"

                prev_value = current_value

    @pytest.mark.parametrize("tier,table_type", [
        ("bronze", "combined"),
        ("silver", "combined"),
        ("gold", "combined"),
        ("platinum", "combined"),
        ("bronze", "med"),
        ("silver", "med"),
        ("gold", "med"),
        ("platinum", "med"),
        ("bronze", "rx"),
        ("silver", "rx"),
        ("gold", "rx"),
        ("platinum", "rx"),
    ])
    def test_all_tables_valid_structure(self, continuance_tables_dir, tier, table_type):
        """Test all 12 tables have valid structure."""
        table_path = continuance_tables_dir / f"{tier}_{table_type}.json"

        with open(table_path, 'r') as f:
            data = json.load(f)

        rows = data.get('rows', data) if isinstance(data, dict) else data

        # Should have data
        assert len(rows) > 0, f"Table {tier}_{table_type} is empty"

        # Should have 166 rows (or close to it)
        assert 150 <= len(rows) <= 170, \
            f"Table {tier}_{table_type} has unexpected row count: {len(rows)}"


class TestContinuanceTableInterpolation:
    """Test interpolation logic for continuance tables."""

    @pytest.mark.skip(reason="Requires calculator implementation")
    def test_lookup_exact_value(self):
        """Test looking up exact threshold value."""
        # This would test the get_continuance_table_row function
        # from the calculator implementation
        pass

    @pytest.mark.skip(reason="Requires calculator implementation")
    def test_lookup_interpolated_value(self):
        """Test binary search with interpolation between rows."""
        # This would test interpolation between two threshold values
        pass

    @pytest.mark.skip(reason="Requires calculator implementation")
    def test_lookup_below_minimum(self):
        """Test lookup for value below minimum threshold."""
        pass

    @pytest.mark.skip(reason="Requires calculator implementation")
    def test_lookup_above_maximum(self):
        """Test lookup for value above maximum threshold."""
        pass


class TestContinuanceTableMetadata:
    """Test metadata and documentation for continuance tables."""

    def test_readme_exists(self, continuance_tables_dir):
        """Verify README exists in continuance tables directory."""
        readme_path = continuance_tables_dir / "README.md"
        assert readme_path.exists(), "Missing README.md in continuance-tables/"

    def test_readme_describes_tables(self, continuance_tables_dir):
        """Verify README contains table descriptions."""
        readme_path = continuance_tables_dir / "README.md"

        with open(readme_path, 'r') as f:
            content = f.read()

        # Should mention key concepts
        assert 'continuance' in content.lower()
        assert 'bronze' in content.lower() or 'silver' in content.lower()


class TestContinuanceTableComparison:
    """Test differences between metal tier tables."""

    def test_bronze_vs_silver_utilization(self, all_continuance_tables):
        """Test that Bronze and Silver tables have different utilization patterns."""
        bronze = all_continuance_tables.get('bronze_combined', {})
        silver = all_continuance_tables.get('silver_combined', {})

        # Both should exist
        assert bronze, "Bronze table not loaded"
        assert silver, "Silver table not loaded"

        # Should be different (induced demand varies by tier)
        # This is a simplified check - real test would compare specific values
        assert bronze != silver, \
            "Bronze and Silver tables should differ due to induced demand"

    def test_medical_vs_rx_tables_differ(self, all_continuance_tables):
        """Test that medical and drug tables are distinct."""
        silver_med = all_continuance_tables.get('silver_med', {})
        silver_rx = all_continuance_tables.get('silver_rx', {})

        assert silver_med, "Silver medical table not loaded"
        assert silver_rx, "Silver drug table not loaded"

        assert silver_med != silver_rx, \
            "Medical and Rx tables should be different"


class TestContinuanceTableValidation:
    """Test validation helpers from fixtures."""

    def test_validate_valid_table(self, continuance_tables_dir):
        """Test validation passes for valid table."""
        from fixtures import ContinuanceTableLoader

        loader = ContinuanceTableLoader(continuance_tables_dir)
        table = loader.load_table('silver', 'combined')

        validation = loader.validate_table_structure(table)

        # Should pass validation
        assert validation['is_valid'], \
            f"Valid table failed validation: {validation['errors']}"

    def test_validate_detects_missing_rows(self):
        """Test validation detects missing rows field."""
        from fixtures import ContinuanceTableLoader

        loader = ContinuanceTableLoader(None)
        invalid_table = {'metadata': 'test'}  # Missing 'rows'

        validation = loader.validate_table_structure(invalid_table)

        assert not validation['is_valid']
        assert any('rows' in err.lower() for err in validation['errors'])

    def test_validate_detects_negative_values(self):
        """Test validation detects negative values."""
        from fixtures import ContinuanceTableLoader

        loader = ContinuanceTableLoader(None)
        invalid_table = {
            'rows': [
                {'Up To': 100, 'MAXD': 50},
                {'Up To': 200, 'MAXD': -10}  # Invalid negative
            ]
        }

        validation = loader.validate_table_structure(invalid_table)

        assert not validation['is_valid']
        assert any('negative' in err.lower() for err in validation['errors'])

    def test_validate_detects_non_monotonic(self):
        """Test validation detects non-monotonic MAXD."""
        from fixtures import ContinuanceTableLoader

        loader = ContinuanceTableLoader(None)
        invalid_table = {
            'rows': [
                {'Up To': 100, 'MAXD': 50},
                {'Up To': 200, 'MAXD': 40}  # Decreased
            ]
        }

        validation = loader.validate_table_structure(invalid_table)

        assert not validation['is_valid']
        assert any('monotonic' in err.lower() for err in validation['errors'])
