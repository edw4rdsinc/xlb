# AV Calculator Tests - Quick Start Guide

## Installation (5 minutes)

```bash
# 1. Navigate to test directory
cd /home/sam/Documents/github-repos/xlb/xlb/tests/av-calculator

# 2. Install test dependencies
pip install -r requirements-test.txt

# 3. Verify installation
pytest --version
```

## Running Tests (Immediate)

### Critical Test (Must Pass)
```bash
# Run TEST-001 (SLI-SBC-4000) - MUST return 72.27% ± 0.01%
pytest -v -m critical

# Expected output:
# test_calculator.py::TestCoreAlgorithm::test_sli_sbc_4000_exact_match PASSED
```

### All Tests
```bash
# Run everything
pytest -v

# Expected: ~65 passed, ~85 skipped (until real calculator implemented)
```

### By Category
```bash
pytest -v -m unit           # Unit tests
pytest -v -m integration    # Integration tests
pytest -v -m edge_case      # Edge cases
pytest -v -m "not slow"     # Fast tests only
```

### Specific Test File
```bash
pytest -v test_calculator.py        # Algorithm tests
pytest -v test_continuance.py       # Table tests
pytest -v test_validation.py        # Validation tests
pytest -v test_edge_cases.py        # Edge cases
```

### Single Test
```bash
pytest -v test_calculator.py::TestCoreAlgorithm::test_sli_sbc_4000_exact_match
```

## Coverage Report (1 minute)

```bash
# Generate HTML coverage report
pytest --cov --cov-report=html

# Open report
open htmlcov/index.html
# or
firefox htmlcov/index.html
```

## Common Commands

```bash
# Show failed tests details
pytest -v --tb=long

# Stop on first failure
pytest -x

# Run last failed tests
pytest --lf

# Run tests matching pattern
pytest -k "deductible"

# Show test durations
pytest --durations=10
```

## Test Structure at a Glance

```
tests/av-calculator/
├── test_calculator.py       # 25+ algorithm tests
├── test_continuance.py      # 20+ table tests
├── test_validation.py       # 25+ validation tests
├── test_edge_cases.py       # 35+ edge case tests
├── test_integration.py      # 20+ integration tests
├── test_api.py              # 25+ API tests (skipped)
├── conftest.py              # Shared fixtures
├── fixtures.py              # Test helpers
└── requirements-test.txt    # Dependencies
```

## Success Criteria

✅ **TEST-001 passes:** 72.27% ± 0.01%
✅ **No test failures:** Only skips are acceptable
✅ **Coverage > 90%:** When calculator is implemented

## Troubleshooting

**Tests not found?**
```bash
export PYTHONPATH=$PWD:$PYTHONPATH
pytest --collect-only
```

**Import errors?**
```bash
pip install -r requirements-test.txt --upgrade
```

**Many tests skipped?**
- Normal until calculator is implemented
- Look for `@pytest.mark.skip` in test files

## Next Steps

1. Implement calculator (Agent 5)
2. Run: `pytest -v -m critical`
3. Fix until TEST-001 passes
4. Run: `pytest -v`
5. Achieve 90%+ coverage

## Help

- Full docs: `README.md`
- Test summary: `TEST_SUMMARY.md`
- Issues: Contact development team
