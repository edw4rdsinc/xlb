# AV Calculator Test Suite

Comprehensive automated test suite for the CMS Actuarial Value (AV) Calculator.

## Overview

This test suite validates the AV calculator implementation against:
- 10 official test cases (TEST-001 through TEST-010)
- 100+ edge cases from the edge-cases catalog
- CMS calculation methodology requirements
- Performance and precision standards

## Test Structure

```
tests/av-calculator/
├── conftest.py              # Pytest configuration and shared fixtures
├── fixtures.py              # Test data builders and helpers
├── requirements-test.txt    # Test dependencies
│
├── test_calculator.py       # Core algorithm tests
├── test_continuance.py      # Continuance table tests
├── test_validation.py       # Input validation tests
├── test_edge_cases.py       # Edge case tests
├── test_integration.py      # End-to-end integration tests
├── test_api.py              # API endpoint tests
│
└── README.md                # This file
```

## Quick Start

### Installation

```bash
cd /home/sam/Documents/github-repos/xlb/xlb/tests/av-calculator
pip install -r requirements-test.txt
```

### Run All Tests

```bash
pytest -v
```

### Run Specific Test Categories

```bash
# Critical tests only (must pass)
pytest -v -m critical

# Unit tests only
pytest -v -m unit

# Integration tests only
pytest -v -m integration

# Edge case tests
pytest -v -m edge_case

# API tests
pytest -v -m api

# Exclude slow tests
pytest -v -m "not slow"
```

### Run Specific Test File

```bash
pytest -v test_calculator.py
pytest -v test_edge_cases.py
```

### Run Specific Test

```bash
pytest -v test_calculator.py::TestCoreAlgorithm::test_sli_sbc_4000_exact_match
```

## Test Coverage

### Generate Coverage Report

```bash
pytest --cov=/home/sam/Documents/github-repos/xlb/xlb/av-calculator \
       --cov-report=html \
       --cov-report=term
```

Open `htmlcov/index.html` to view detailed coverage report.

### Coverage Goals

- **Overall Coverage:** 90%+
- **Core Algorithm:** 95%+
- **Validation Logic:** 95%+
- **Edge Cases:** 85%+

## Test Categories

### 1. Core Algorithm Tests (`test_calculator.py`)

Tests fundamental AV calculation:
- ✅ **TEST-001 (CRITICAL):** SLI-SBC-4000 must return 72.27% ± 0.01%
- ✅ All 10 test cases (TEST-001 through TEST-010)
- Metal tier classification
- Deductible, coinsurance, and MOOP calculations
- HSA/HRA adjustments
- Performance benchmarks
- Numerical stability

**Critical Test:**
```bash
pytest -v test_calculator.py::TestCoreAlgorithm::test_sli_sbc_4000_exact_match
```

This test **MUST PASS** for implementation to be considered correct.

### 2. Continuance Table Tests (`test_continuance.py`)

Tests continuance table data:
- All 12 tables load successfully
- 166 rows per table
- Data integrity (no negatives, monotonic)
- Interpolation logic
- Table validation

### 3. Validation Tests (`test_validation.py`)

Tests input validation:
- Deductible ≤ MOOP
- Coinsurance range (0-100%)
- Preventive care requirements (ACA compliance)
- Missing field detection
- Data type validation
- Warning generation

### 4. Edge Case Tests (`test_edge_cases.py`)

Tests edge cases from catalog:
- Zero deductible plans
- HDHP structures
- Deductible = MOOP
- Separate medical/drug deductibles
- Specialty drugs not covered
- HSA contributions
- Service-level exemptions
- Boundary conditions

### 5. Integration Tests (`test_integration.py`)

End-to-end tests:
- Full calculation pipeline
- Batch processing
- Continuance table integration
- Regression testing
- Error handling
- Performance under load

### 6. API Tests (`test_api.py`)

REST API endpoint tests (if implemented):
- Calculate endpoint
- Validate endpoint
- Batch processing
- Error responses
- Rate limiting
- Authentication
- CORS headers

## Test Data

### Test Plans Inventory

10 official test cases located at:
```
/home/sam/Documents/github-repos/xlb/test-cases/test-plans-inventory.json
```

**Test Plans:**
1. **TEST-001:** SLI-SBC-4000 (VALIDATED - 72.27%)
2. **TEST-002:** Bronze 60 Generic
3. **TEST-003:** Silver 70 Generic
4. **TEST-004:** Gold 80 Generic
5. **TEST-005:** Bronze 60 HDHP (Covered CA)
6. **TEST-006:** Silver 70 (Covered CA)
7. **TEST-007:** Silver 70 (NY State)
8. **TEST-008:** Bronze 60 HDHP (Kaiser)
9. **TEST-009:** Platinum 90 Generic
10. **TEST-010:** Silver CSR 87%

### Continuance Tables

Located at:
```
/home/sam/Documents/github-repos/xlb/xlb/data/continuance-tables/
```

**Tables:**
- Bronze: combined, med, rx
- Silver: combined, med, rx
- Gold: combined, med, rx
- Platinum: combined, med, rx

## Pytest Markers

Tests are marked with categories:

- `@pytest.mark.critical` - Must pass (TEST-001)
- `@pytest.mark.unit` - Unit tests
- `@pytest.mark.integration` - Integration tests
- `@pytest.mark.edge_case` - Edge case tests
- `@pytest.mark.api` - API tests
- `@pytest.mark.slow` - Slow tests (>5s)
- `@pytest.mark.skip` - Skipped (pending implementation)

## Continuous Integration

### GitHub Actions Workflow

File: `.github/workflows/test-av-calculator.yml`

```yaml
name: AV Calculator Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r xlb/tests/av-calculator/requirements-test.txt

      - name: Run tests
        run: |
          cd xlb/tests/av-calculator
          pytest -v --cov --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
```

## Test Results

### Expected Results (with mock calculator)

| Test Suite | Total | Passed | Failed | Skipped |
|------------|-------|--------|--------|---------|
| Core Algorithm | 25 | 15 | 0 | 10 |
| Continuance | 20 | 15 | 0 | 5 |
| Validation | 25 | 10 | 0 | 15 |
| Edge Cases | 35 | 15 | 0 | 20 |
| Integration | 20 | 10 | 0 | 10 |
| API | 25 | 0 | 0 | 25 |
| **TOTAL** | **150** | **65** | **0** | **85** |

**Note:** Many tests are skipped pending real calculator implementation.

### Critical Success Criteria

✅ **MUST PASS:**
- `test_sli_sbc_4000_exact_match` - Returns 72.27% ± 0.01%

✅ **SHOULD PASS:**
- All 10 test cases within tolerance
- All continuance tables load
- All validation rules enforce

✅ **NICE TO HAVE:**
- Edge cases handled gracefully
- Performance < 500ms per calculation
- 90%+ code coverage

## Regression Testing

### Generate Baseline

```bash
pytest test_integration.py::TestDataPersistence::test_regression_baseline_generation
```

Saves baseline results to `baseline_results.json`

### Compare with Baseline

```bash
pytest test_integration.py::TestDataPersistence::test_regression_comparison
```

Reports any differences from baseline.

## Performance Testing

### Run Performance Tests

```bash
pytest -v -m benchmark
```

### Performance Goals

- Single calculation: < 500ms
- 10 test cases: < 2 seconds
- 1000 calculations: < 30 seconds

## Troubleshooting

### Common Issues

**1. ModuleNotFoundError: No module named 'fixtures'**
```bash
# Ensure you're in the test directory
cd /home/sam/Documents/github-repos/xlb/xlb/tests/av-calculator
export PYTHONPATH=$PWD:$PYTHONPATH
pytest -v
```

**2. FileNotFoundError: Test cases not found**
```bash
# Verify test-cases directory exists
ls -la /home/sam/Documents/github-repos/xlb/test-cases/
```

**3. Many tests skipped**
- This is expected until calculator is fully implemented
- Tests marked with `@pytest.mark.skip` will be skipped
- Implement calculator features to enable tests

**4. TEST-001 fails**
- This is the critical test
- Check calculator implementation against pseudocode
- Verify continuance table loading
- Check for rounding errors

## Development Workflow

### Test-Driven Development

1. **Write test first** (based on requirements)
2. **Run test** - should fail (red)
3. **Implement feature**
4. **Run test** - should pass (green)
5. **Refactor** if needed
6. **Repeat**

### Before Committing

```bash
# Run all tests
pytest -v

# Check coverage
pytest --cov --cov-report=term

# Run only fast tests
pytest -v -m "not slow"

# Ensure critical test passes
pytest -v -m critical
```

## Contributing

### Adding New Tests

1. Choose appropriate test file
2. Add test function with descriptive name
3. Add appropriate markers
4. Document test purpose
5. Run test to verify
6. Update this README if needed

### Test Naming Convention

- `test_<feature>_<scenario>` - Unit tests
- `test_<workflow>_integration` - Integration tests
- `test_<edge_case>_edge_case` - Edge cases

## References

- **Test Plans:** `/home/sam/Documents/github-repos/xlb/test-cases/`
- **Edge Cases:** `/home/sam/Documents/github-repos/xlb/edge-cases-catalog.md`
- **Pseudocode:** `/home/sam/Documents/github-repos/xlb/av-pseudocode.py`
- **CMS Spec:** `/home/sam/Documents/github-repos/xlb/cms-av-specification.md`

## Contact

For questions or issues with the test suite, contact the development team.

---

**Version:** 1.0.0
**Last Updated:** 2025-11-07
**Status:** Ready for implementation
