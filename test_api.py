import sys
import os
import requests
import json

try:
    import pytest
except ImportError:
    pytest = None

# Ensure backend folder is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

sys.stdout.reconfigure(encoding='utf-8')

scenarios = [
    {
        "name": "Scenario 1: ₹10,000 @ 5% monthly flat for 12 months",
        "payload": {
            "principal": 10000,
            "rate": 5,
            "rate_type": "monthly",
            "tenure_months": 12,
            "repayment_type": "flat",
            "lang": "hi"
        }
    },
    {
        "name": "Scenario 2: ₹5,000 @ 24% annual reducing for 6 months",
        "payload": {
            "principal": 5000,
            "rate": 24,
            "rate_type": "annual",
            "tenure_months": 6,
            "repayment_type": "reducing",
            "lang": "hi"
        }
    },
    {
        "name": "Scenario 3: ₹10,000 @ 4% with 'not_sure' rate and repayment type",
        "payload": {
            "principal": 10000,
            "rate": 4,
            "rate_type": "not_sure",
            "tenure_months": 12,
            "repayment_type": "not_sure",
            "lang": "hi"
        }
    }
]

def test_api_scenario_1_flat_rate_monthly():
    res = client.post("/api/calculate", json=scenarios[0]["payload"])
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    data = body["data"]
    assert data["principal"] == 10000
    assert data["total_repayment"] == 16000
    assert data["danger_level"] == "HIGH"

def test_api_scenario_2_reducing_rate_annual():
    res = client.post("/api/calculate", json=scenarios[1]["payload"])
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    data = body["data"]
    assert data["principal"] == 5000
    assert data["danger_level"] == "MEDIUM"

def test_api_scenario_3_not_sure_defaults():
    res = client.post("/api/calculate", json=scenarios[2]["payload"])
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    data = body["data"]
    assert data["repayment_type_used"] == "flat"
    assert data["rate_type_used"] == "monthly"

if __name__ == "__main__":
    BASE_URL = "http://127.0.0.1:8000/api/calculate"
    print("Testing DebtTrap API Endpoints...")
    for sc in scenarios:
        print("=" * 60)
        print(sc["name"])
        try:
            res = requests.post(BASE_URL, json=sc["payload"]).json()
        except Exception:
            print("(Live server not reachable on port 8000, using TestClient fallback...)")
            res = client.post("/api/calculate", json=sc["payload"]).json()
        
        data = res["data"]
        print(f"Principal: ₹{data['principal']}")
        print(f"Total Repayment: ₹{data['total_repayment']}")
        print(f"Monthly EMI: ₹{data['monthly_emi']}")
        print(f"Effective APR: {data['effective_annual_rate']}%")
        print(f"Multiplier: {data['repayment_multiplier']}x")
        print(f"Danger Level: {data['danger_level']} ({data['danger_label']})")
        print(f"Extra Cost vs Bank: ₹{data['comparison_at_bank_rate']['extra_cost_vs_bank']}")
        print(f"AI Explanation ({res['explanation_source']}):\n{res['ai_explanation']}")

