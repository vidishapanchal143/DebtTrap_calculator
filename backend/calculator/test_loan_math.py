"""
Unit tests for DebtTrap Escape Loan Math Module.
Verifies flat-vs-reducing balance math, effective APR, bank comparison, fees, penalties, and edge cases.
"""
import sys
import os

try:
    import pytest
    approx = pytest.approx
except ImportError:
    class Approx:
        def __init__(self, expected, abs=1e-2):
            self.expected = expected
            self.abs = abs
        def __eq__(self, actual):
            return abs(actual - self.expected) <= self.abs
    approx = Approx

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from calculator.loan_math import calculate_loan_details
    from explain.gemini_explainer import generate_fallback_explanation, generate_loan_explanation
except ImportError:
    from loan_math import calculate_loan_details
    from gemini_explainer import generate_fallback_explanation, generate_loan_explanation


def test_scenario_1_flat_rate_monthly():
    """
    Scenario 1: ₹10,000 at 5% monthly flat for 12 months.
    - Principal: ₹10,000
    - Rate: 5% monthly flat (60% p.a. flat)
    - Total Interest: 10000 * 0.05 * 12 = ₹6,000
    - Total Repayment: ₹16,000
    - Repayment Multiplier: 1.6x
    - Effective APR: >100% due to declining balance principal paydown.
    """
    res = calculate_loan_details(
        principal=10000,
        rate=5.0,
        rate_type="monthly",
        tenure_months=12,
        repayment_type="flat"
    )
    
    assert res["principal"] == 10000.0
    assert res["total_interest"] == 6000.0
    assert res["total_repayment"] == 16000.0
    assert res["monthly_emi"] == approx(1333.33, abs=0.05)
    assert res["repayment_multiplier"] == 1.6
    assert res["effective_annual_rate"] > 100.0  # ~107.5% APR
    assert res["danger_level"] == "HIGH"

def test_scenario_2_reducing_rate_annual():
    """
    Scenario 2: ₹5,000 at 24% annual reducing for 6 months.
    - Principal: ₹5,000
    - Rate: 24% annual reducing => 2% per month
    - Tenure: 6 months
    - Expected EMI: ~₹892.63
    - Total Repayment: ~₹5,355.78
    - Total Interest: ~₹355.78
    - Effective APR: ~24% p.a.
    """
    res = calculate_loan_details(
        principal=5000,
        rate=24.0,
        rate_type="annual",
        tenure_months=6,
        repayment_type="reducing"
    )

    assert res["principal"] == 5000.0
    assert res["monthly_emi"] == approx(892.63, abs=0.5)
    assert res["total_repayment"] == approx(5355.78, abs=1.0)
    assert res["total_interest"] == approx(355.78, abs=1.0)
    assert res["repayment_multiplier"] == 1.07
    # Effective compounded APR for 2% monthly rate: ((1.02)^12 - 1) * 100 = 26.82%
    assert res["effective_annual_rate"] == approx(26.82, abs=1.0)
    assert res["danger_level"] == "MEDIUM"

def test_scenario_3_not_sure_edge_case():
    """
    Scenario 3: ₹10,000 at 4% rate with 'not_sure' rate type and 'not_sure' repayment type.
    - Because rate <= 5.0, it should default to monthly rate (4% monthly = 48% p.a. flat).
    - Repayment type 'not_sure' defaults to flat rate.
    - Assumptions list should document both defaults.
    """
    res = calculate_loan_details(
        principal=10000,
        rate=4.0,
        rate_type="not_sure",
        tenure_months=12,
        repayment_type="not_sure"
    )

    assert res["repayment_type_used"] == "flat"
    assert res["rate_type_used"] == "monthly"
    assert res["total_interest"] == 4800.0
    assert res["total_repayment"] == 14800.0
    assert len(res["assumptions_made"]) >= 2
    assert res["danger_level"] == "HIGH"

def test_bank_comparison():
    """
    Verifies bank contrast calculations (10% PMMY bank rate).
    """
    res = calculate_loan_details(
        principal=10000,
        rate=5.0,
        rate_type="monthly",
        tenure_months=12,
        repayment_type="flat"
    )

    bank = res["comparison_at_bank_rate"]
    # 10% reducing on 10,000 for 12 mo: total repayment ~ ₹10,549.91
    assert bank["bank_total_repayment"] == approx(10549.91, abs=5.0)
    # Extra cost user pays vs bank: 16000 - 10550 = ~5450
    assert bank["extra_cost_vs_bank"] == approx(5450.09, abs=5.0)

def test_processing_fee_and_late_penalty():
    """
    Verifies optional processing fee and late penalty calculation.
    """
    res = calculate_loan_details(
        principal=10000,
        rate=12.0,
        rate_type="annual",
        tenure_months=12,
        repayment_type="reducing",
        processing_fee_pct=2.0,
        late_penalty_pct=5.0
    )

    assert res["processing_fee_pct"] == 2.0
    assert res["processing_fee_amount"] == 200.0
    assert res["late_penalty_pct"] == 5.0
    assert res["late_penalty_amount"] == approx(44.42, abs=0.5)

def test_zero_interest_loan():
    """
    Verifies 0% interest loan behavior with zero fees.
    """
    res = calculate_loan_details(
        principal=12000,
        rate=0.0,
        rate_type="annual",
        tenure_months=12,
        repayment_type="reducing"
    )

    assert res["monthly_emi"] == 1000.0
    assert res["total_interest"] == 0.0
    assert res["total_repayment"] == 12000.0
    assert res["danger_level"] == "LOW"

def test_explainer_fallback_languages():
    """
    Verifies local fallback explanation generation in Hindi, Gujarati, and English.
    """
    sample_data = {
        "principal": 10000,
        "total_repayment": 16000,
        "repayment_multiplier": 1.6,
        "comparison_at_bank_rate": {
            "extra_cost_vs_bank": 5450
        }
    }

    hi_exp = generate_fallback_explanation(sample_data, lang="hi")
    assert "₹10,000" in hi_exp
    assert "₹16,000" in hi_exp

    gu_exp = generate_fallback_explanation(sample_data, lang="gu")
    assert "₹10,000" in gu_exp
    assert "ગણા" in gu_exp

    en_exp = generate_fallback_explanation(sample_data, lang="en")
    assert "₹10,000" in en_exp
    assert "pay back" in en_exp

def test_predatory_loan_shark_rate():
    """
    Tough Test 1: Predatory Loan Shark (10% monthly flat for 24 months).
    - Principal: ₹50,000
    - Rate: 10% per month flat (120% p.a. flat rate)
    - Total Interest: 50,000 * 1.20 * 2 = ₹1,20,000
    - Total Repayment: ₹1,70,000
    - Repayment Multiplier: 3.4x
    - Verifies extreme APR calculation (>200% APR) and HIGH danger level rating.
    """
    res = calculate_loan_details(
        principal=50000,
        rate=10.0,
        rate_type="monthly",
        tenure_months=24,
        repayment_type="flat"
    )

    assert res["principal"] == 50000.0
    assert res["total_interest"] == 120000.0
    assert res["total_repayment"] == 170000.0
    assert res["repayment_multiplier"] == 3.4
    assert res["effective_annual_rate"] > 200.0
    assert res["danger_level"] == "HIGH"

def test_excessive_processing_fee_trap():
    """
    Tough Test 2: Deceptive Processing Fee Trap (0% interest but 50% upfront fee).
    - Principal: ₹5,000
    - Processing Fee: 50% (₹2,500 fee upfront, net disbursed = ₹2,500)
    - Tenure: 1 month
    - Borrower receives ₹2,500 net but pays back ₹5,000 in 1 month (100% gain per month).
    - True effective APR should reflect massive APR (>1000%), not 0%.
    """
    res = calculate_loan_details(
        principal=5000,
        rate=0.0,
        rate_type="annual",
        tenure_months=1,
        repayment_type="reducing",
        processing_fee_pct=50.0
    )

    assert res["principal"] == 5000.0
    assert res["processing_fee_amount"] == 2500.0
    assert res["total_repayment"] == 7500.0
    # Effective APR for doubling money in 1 month: ((1 + 1.0)^12 - 1) * 100 = 409500%
    assert res["effective_annual_rate"] > 1000.0
    assert res["danger_level"] == "HIGH"

def test_120_month_long_tenure():
    """
    Tough Test 3: Multi-Decade Long Tenure (120 months = 10 years).
    - Principal: ₹5,00,000
    - Rate: 18% annual reducing rate
    - Tenure: 120 months
    - Exact EMI = 9009.26
    - Total repayment = 1,081,111.20
    """
    res = calculate_loan_details(
        principal=500000,
        rate=18.0,
        rate_type="annual",
        tenure_months=120,
        repayment_type="reducing"
    )

    assert res["principal"] == 500000.0
    assert res["monthly_emi"] == approx(9009.26, abs=0.5)
    assert res["total_repayment"] == approx(1081111.20, abs=5.0)
    assert res["effective_annual_rate"] == approx(19.56, abs=1.0)
    assert res["danger_level"] == "MEDIUM"

def test_zero_or_invalid_inputs_resilience():
    """
    Tough Test 4: Extreme Negative / Zero / Boundary Inputs.
    - Principal: -100 (should be sanitized to 1.0)
    - Rate: -5.0 (should be sanitized to 0.0)
    - Tenure: 0 (should be sanitized to 1)
    - Processing Fee: 150.0 (should be capped at 95.0%)
    """
    res = calculate_loan_details(
        principal=-100,
        rate=-5.0,
        rate_type="monthly",
        tenure_months=0,
        repayment_type="flat",
        processing_fee_pct=150.0
    )

    assert res["principal"] == 1.0
    assert res["rate"] == 0.0
    assert res["tenure_months"] == 1
    assert res["processing_fee_pct"] == 95.0
    assert res["processing_fee_amount"] == 0.95

def test_not_sure_high_annual_rate():
    """
    Tough Test 5: 'Not Sure' Rate Type with High Stated Rate (18%).
    - Since 18.0 > 5.0, system should assume annual rate.
    - 18% FLAT annual rate effective APR is ~37.38% (compounded), which correctly triggers HIGH danger level (>36% RBI threshold)!
    """
    res = calculate_loan_details(
        principal=10000,
        rate=18.0,
        rate_type="not_sure",
        tenure_months=12,
        repayment_type="flat"
    )

    assert res["rate_type_used"] == "annual"
    assert res["total_interest"] == 1800.0
    assert res["total_repayment"] == 11800.0
    assert res["effective_annual_rate"] == approx(37.38, abs=1.0)
    assert res["danger_level"] == "HIGH"

def test_fractional_currency_rounding():
    """
    Tough Test 6: Odd Fractional Numbers & Rounding Precision.
    - Principal: ₹1,234.56
    - Rate: 7.89% monthly
    - Tenure: 5 months
    """
    res = calculate_loan_details(
        principal=1234.56,
        rate=7.89,
        rate_type="monthly",
        tenure_months=5,
        repayment_type="flat"
    )

    assert isinstance(res["monthly_emi"], float)
    assert isinstance(res["total_repayment"], float)
    assert isinstance(res["total_interest"], float)
    # Total interest = 1234.56 * (0.0789 * 12) * (5 / 12) = 1234.56 * 0.0789 * 5 = ₹487.03
    assert res["total_interest"] == approx(487.03, abs=0.1)

if __name__ == "__main__":
    test_scenario_1_flat_rate_monthly()
    test_scenario_2_reducing_rate_annual()
    test_scenario_3_not_sure_edge_case()
    test_bank_comparison()
    test_processing_fee_and_late_penalty()
    test_zero_interest_loan()
    test_explainer_fallback_languages()
    test_predatory_loan_shark_rate()
    test_excessive_processing_fee_trap()
    test_120_month_long_tenure()
    test_zero_or_invalid_inputs_resilience()
    test_not_sure_high_annual_rate()
    test_fractional_currency_rounding()
    print("All 13 backend loan math & explainer edge case tests passed successfully!")


