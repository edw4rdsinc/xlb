"""
Test Suite for AV Calculator API

Tests all endpoints, validation, error handling, and integration.
"""

import pytest
from fastapi.testclient import TestClient
from .main import app

# Create test client
client = TestClient(app)


class TestHealthCheckEndpoint:
    """Test health check endpoint."""

    def test_health_check_returns_200(self):
        """Test that health check returns 200 OK."""
        response = client.get("/api/av-calculator/health")
        assert response.status_code == 200

    def test_health_check_response_structure(self):
        """Test health check response has correct structure."""
        response = client.get("/api/av-calculator/health")
        data = response.json()

        assert "status" in data
        assert "timestamp" in data
        assert "version" in data
        assert data["status"] == "healthy"
        assert data["version"] == "1.0.0"


class TestCalculateEndpoint:
    """Test POST /api/av-calculator/calculate endpoint."""

    def test_calculate_valid_plan(self):
        """Test successful calculation with valid parameters."""
        plan_data = {
            "deductible_individual": 4000,
            "deductible_family": 10000,
            "moop_individual": 9100,
            "moop_family": 18200,
            "coinsurance_medical": 0.20,
            "primary_care_copay": 45,
            "specialist_copay": 45,
            "er_copay": 350,
            "generic_copay": 10,
            "preferred_brand_copay": 50,
            "non_preferred_copay": 75,
            "metal_tier": "Silver"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200

        data = response.json()
        assert data["success"] == True
        assert "av_percentage" in data
        assert "metal_tier" in data
        assert "calculation_time_ms" in data
        assert "details" in data

        # AV should be around 72.27% for TEST-001 parameters
        assert 70 <= data["av_percentage"] <= 75

    def test_calculate_minimal_plan(self):
        """Test calculation with minimal required parameters."""
        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.30,
            "metal_tier": "Bronze"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200

        data = response.json()
        assert data["success"] == True
        assert 55 <= data["av_percentage"] <= 65  # Bronze range

    def test_calculate_invalid_deductible(self):
        """Test that invalid deductible is rejected."""
        plan_data = {
            "deductible_individual": 20000,  # Too high
            "deductible_family": 40000,
            "moop_individual": 25000,
            "moop_family": 50000,
            "coinsurance_medical": 0.20,
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422  # Validation error

    def test_calculate_moop_less_than_deductible(self):
        """Test that MOOP < deductible is rejected."""
        plan_data = {
            "deductible_individual": 5000,
            "deductible_family": 10000,
            "moop_individual": 3000,  # Less than deductible
            "moop_family": 6000,
            "coinsurance_medical": 0.20,
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422  # Validation error

    def test_calculate_invalid_coinsurance(self):
        """Test that invalid coinsurance is rejected."""
        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 1.5,  # > 1.0
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422

    def test_calculate_invalid_metal_tier(self):
        """Test that invalid metal tier is rejected."""
        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.20,
            "metal_tier": "Diamond"  # Invalid
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422

    def test_calculate_missing_required_fields(self):
        """Test that missing required fields are rejected."""
        plan_data = {
            "deductible_individual": 2000,
            # Missing other required fields
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422

    def test_calculate_negative_values(self):
        """Test that negative values are rejected."""
        plan_data = {
            "deductible_individual": -1000,  # Negative
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.20,
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422

    def test_calculate_with_hsa(self):
        """Test calculation with HSA contribution."""
        plan_data = {
            "deductible_individual": 3000,
            "deductible_family": 6000,
            "moop_individual": 7000,
            "moop_family": 14000,
            "coinsurance_medical": 0.20,
            "hsa_contribution": 1000,
            "metal_tier": "Bronze"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200

        data = response.json()
        assert data["success"] == True

    def test_calculate_response_has_all_fields(self):
        """Test that response has all expected fields."""
        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.20,
            "metal_tier": "Silver"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        data = response.json()

        assert "success" in data
        assert "av_percentage" in data
        assert "metal_tier" in data
        assert "calculation_time_ms" in data
        assert "details" in data

        details = data["details"]
        assert "plan_pays" in details
        assert "member_pays" in details
        assert "total_expected_cost" in details
        assert "breakdown" in details
        assert "adjusted_values" in details


class TestValidateEndpoint:
    """Test GET /api/av-calculator/validate endpoint."""

    def test_validate_returns_200(self):
        """Test that validate endpoint returns 200."""
        response = client.get("/api/av-calculator/validate")
        assert response.status_code == 200

    def test_validate_test_001(self):
        """Test that TEST-001 validation returns expected AV."""
        response = client.get("/api/av-calculator/validate")
        data = response.json()

        assert "av_percentage" in data
        assert "metal_tier" in data

        # Should return 72.27% ± 0.01%
        expected_av = 72.27
        tolerance = 0.01
        assert abs(data["av_percentage"] - expected_av) <= tolerance

        assert data["metal_tier"] == "Silver"

    def test_validate_has_test_details(self):
        """Test that validate response includes test details."""
        response = client.get("/api/av-calculator/validate")
        data = response.json()

        assert "details" in data
        details = data["details"]

        assert "expected_av" in details
        assert "difference" in details
        assert "test_status" in details


class TestCORSHeaders:
    """Test CORS configuration."""

    def test_cors_headers_present(self):
        """Test that CORS headers are present."""
        response = client.options("/api/av-calculator/calculate")
        assert "access-control-allow-origin" in response.headers

    def test_cors_allows_localhost(self):
        """Test that localhost is allowed."""
        headers = {"Origin": "http://localhost:3000"}
        response = client.get("/api/av-calculator/health", headers=headers)
        assert response.status_code == 200


class TestErrorResponses:
    """Test error response formats."""

    def test_validation_error_format(self):
        """Test that validation errors have correct format."""
        plan_data = {
            "deductible_individual": 20000,  # Invalid
            "deductible_family": 40000,
            "moop_individual": 25000,
            "moop_family": 50000,
            "coinsurance_medical": 0.20,
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 422

        # Pydantic validation error format
        data = response.json()
        assert "detail" in data

    def test_404_for_invalid_endpoint(self):
        """Test 404 for non-existent endpoint."""
        response = client.get("/api/av-calculator/nonexistent")
        assert response.status_code == 404


class TestRootEndpoint:
    """Test root endpoint."""

    def test_root_returns_200(self):
        """Test root endpoint returns 200."""
        response = client.get("/")
        assert response.status_code == 200

    def test_root_has_api_info(self):
        """Test root endpoint returns API information."""
        response = client.get("/")
        data = response.json()

        assert "name" in data
        assert "version" in data
        assert "docs" in data
        assert "health" in data


class TestAPIDocumentation:
    """Test API documentation endpoints."""

    def test_openapi_schema_available(self):
        """Test that OpenAPI schema is available."""
        response = client.get("/api/av-calculator/openapi.json")
        assert response.status_code == 200

        schema = response.json()
        assert "openapi" in schema
        assert "paths" in schema
        assert "info" in schema

    def test_docs_redirect_available(self):
        """Test that docs endpoint is available."""
        response = client.get("/api/av-calculator/docs", follow_redirects=False)
        # Should return HTML or redirect
        assert response.status_code in [200, 307]


class TestEdgeCases:
    """Test edge cases and unusual inputs."""

    def test_zero_deductible(self):
        """Test plan with zero deductible."""
        plan_data = {
            "deductible_individual": 0,
            "deductible_family": 0,
            "moop_individual": 5000,
            "moop_family": 10000,
            "coinsurance_medical": 0.20,
            "metal_tier": "Gold"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200

        data = response.json()
        assert data["success"] == True
        # Should have higher AV with no deductible
        assert data["av_percentage"] > 70

    def test_deductible_equals_moop(self):
        """Test plan where deductible equals MOOP."""
        plan_data = {
            "deductible_individual": 5000,
            "deductible_family": 10000,
            "moop_individual": 5000,
            "moop_family": 10000,
            "coinsurance_medical": 0.20,
            "metal_tier": "Bronze"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200

        data = response.json()
        assert data["success"] == True

    def test_zero_coinsurance(self):
        """Test plan with zero coinsurance."""
        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.0,  # No coinsurance
            "metal_tier": "Platinum"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200

        data = response.json()
        assert data["success"] == True
        # Should have very high AV with no coinsurance
        assert data["av_percentage"] > 80

    def test_maximum_values(self):
        """Test plan with maximum allowed values."""
        plan_data = {
            "deductible_individual": 10600,
            "deductible_family": 21200,
            "moop_individual": 10600,
            "moop_family": 21200,
            "coinsurance_medical": 1.0,  # 100% member pays
            "metal_tier": "Bronze"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        assert response.status_code == 200


class TestPerformance:
    """Test API performance."""

    def test_response_time_under_500ms(self):
        """Test that response time is under 500ms."""
        import time

        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.20,
            "metal_tier": "Silver"
        }

        start = time.time()
        response = client.post("/api/av-calculator/calculate", json=plan_data)
        duration_ms = (time.time() - start) * 1000

        assert response.status_code == 200
        assert duration_ms < 500  # Should be under 500ms

    def test_calculation_time_in_response(self):
        """Test that calculation time is included in response."""
        plan_data = {
            "deductible_individual": 2000,
            "deductible_family": 4000,
            "moop_individual": 6000,
            "moop_family": 12000,
            "coinsurance_medical": 0.20,
            "metal_tier": "Silver"
        }

        response = client.post("/api/av-calculator/calculate", json=plan_data)
        data = response.json()

        assert "calculation_time_ms" in data
        assert data["calculation_time_ms"] > 0
        assert data["calculation_time_ms"] < 1000  # Reasonable upper bound


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
