"""
Loan Math Module for DebtTrap Escape
Provides pure deterministic calculations for loan interest, total repayment,
monthly EMI, effective annual percentage rate (APR), bank contrast, and risk level.
"""

def calculate_irr(cash_flows, iterations=100, tolerance=1e-7):
    """
    Calculates Internal Rate of Return (IRR) per payment period using Newton-Raphson method.
    cash_flows[0] is negative (disbursed amount), cash_flows[1:] are positive EMIs.
    """
    if not cash_flows or cash_flows[0] >= 0:
        return 0.0

    rate = 0.05  # initial guess: 5% per period
    for _ in range(iterations):
        if (1 + rate) <= 1e-6:
            rate = 0.001

        try:
            npv = sum(cf / ((1 + rate) ** i) for i, cf in enumerate(cash_flows))
            d_npv = sum(-i * cf / ((1 + rate) ** (i + 1)) for i, cf in enumerate(cash_flows))
        except (OverflowError, ZeroDivisionError):
            break

        if abs(d_npv) < 1e-12:
            break
        new_rate = rate - npv / d_npv
        if abs(new_rate - rate) < tolerance:
            return min(10.0, max(-0.99, new_rate))
        rate = min(10.0, max(-0.99, new_rate))  # prevent negative or divergent rates
    return min(10.0, max(-0.99, rate))

def calculate_loan_details(
    principal: float,
    rate: float,
    rate_type: str = "annual",       # "monthly", "annual", "not_sure"
    tenure_months: int = 12,
    repayment_type: str = "flat",     # "flat", "reducing", "not_sure"
    processing_fee_pct: float = 0.0,
    late_penalty_pct: float = 0.0,
):
    """
    Calculates detailed loan breakdown.
    
    Handles 'not_sure' defaults gracefully:
    - If repayment_type is 'not_sure', defaults to 'flat' (common deceptive practice in informal lending).
    - If rate_type is 'not_sure': if rate <= 5.0, treats as monthly (e.g., 5% per month); else annual.
    """
    principal = max(1.0, float(principal))
    tenure_months = max(1, int(tenure_months))
    rate = max(0.0, float(rate))
    processing_fee_pct = max(0.0, min(95.0, float(processing_fee_pct)))
    late_penalty_pct = max(0.0, float(late_penalty_pct))

    assumptions_made = []

    # Handle repayment_type "not_sure"
    actual_repayment_type = repayment_type.lower()
    if actual_repayment_type not in ["flat", "reducing"]:
        actual_repayment_type = "flat"
        assumptions_made.append("Defaulted to Flat Rate repayment ('Not Sure' selected). Informal local loans usually charge interest on full principal.")

    # Handle rate_type "not_sure"
    actual_rate_type = rate_type.lower()
    if actual_rate_type not in ["monthly", "annual"]:
        if rate <= 5.0:
            actual_rate_type = "monthly"
            assumptions_made.append(f"Assumed {rate}% is per month since informal local loans typically charge monthly rates when 5% or less.")
        else:
            actual_rate_type = "annual"
            assumptions_made.append(f"Assumed {rate}% is annual interest rate.")

    # Convert rate to monthly & annual flat/stated rates
    if actual_rate_type == "monthly":
        monthly_stated_rate = rate / 100.0
        annual_stated_rate = (rate * 12) / 100.0
    else:  # annual
        annual_stated_rate = rate / 100.0
        monthly_stated_rate = (rate / 12) / 100.0

    processing_fee_amount = (processing_fee_pct / 100.0) * principal

    # Calculation logic based on repayment type
    if actual_repayment_type == "flat":
        # Flat Rate: Interest = Principal * (annual_flat_rate) * (tenure / 12)
        total_interest = principal * annual_stated_rate * (tenure_months / 12.0)
        total_repayment = principal + total_interest + processing_fee_amount
        monthly_emi = (principal + total_interest) / tenure_months

        # Calculate true effective APR using Newton-Raphson IRR
        net_disbursed = principal - processing_fee_amount
        cash_flows = [-net_disbursed] + [monthly_emi] * tenure_months
        monthly_irr = calculate_irr(cash_flows)
        # Annualize IRR (compounded APR)
        effective_apr = (((1 + monthly_irr) ** 12) - 1) * 100.0

    else:
        # Reducing Balance Rate
        r_m = monthly_stated_rate
        if r_m > 0:
            # EMI = P * r_m * (1 + r_m)^N / ((1 + r_m)^N - 1)
            power_factor = (1 + r_m) ** tenure_months
            monthly_emi = (principal * r_m * power_factor) / (power_factor - 1)
        else:
            monthly_emi = principal / tenure_months

        total_repayment_without_fees = monthly_emi * tenure_months
        total_interest = total_repayment_without_fees - principal
        total_repayment = total_repayment_without_fees + processing_fee_amount

        # Effective APR for reducing balance
        net_disbursed = principal - processing_fee_amount
        cash_flows = [-net_disbursed] + [monthly_emi] * tenure_months
        monthly_irr = calculate_irr(cash_flows)
        effective_apr = (((1 + monthly_irr) ** 12) - 1) * 100.0

    effective_apr = max(0.0, effective_apr)
    repayment_multiplier = total_repayment / principal
    late_penalty_amount = (late_penalty_pct / 100.0) * monthly_emi

    # Bank Benchmark Contrast (10% p.a. Reducing Rate - Pradhan Mantri Mudra Yojana style)
    bank_r_m = (10.0 / 12.0) / 100.0
    bank_power = (1 + bank_r_m) ** tenure_months
    bank_emi = (principal * bank_r_m * bank_power) / (bank_power - 1)
    bank_total_repayment = bank_emi * tenure_months
    bank_total_interest = bank_total_repayment - principal
    extra_cost_vs_bank = max(0.0, total_repayment - bank_total_repayment)

    # Danger Level based on RBI guidelines (36% APR threshold for high-risk / predatory microloans)
    if effective_apr > 36.0:
        danger_level = "HIGH"
        danger_label = "High Risk / Deceptive (RBI >36% limit)"
    elif effective_apr > 18.0:
        danger_level = "MEDIUM"
        danger_label = "Moderate Risk (Higher than standard bank loans)"
    else:
        danger_level = "LOW"
        danger_label = "Fair / Standard Rate"

    return {
        "principal": round(principal, 2),
        "rate": rate,
        "rate_type_input": rate_type,
        "rate_type_used": actual_rate_type,
        "repayment_type_input": repayment_type,
        "repayment_type_used": actual_repayment_type,
        "tenure_months": tenure_months,
        "processing_fee_pct": processing_fee_pct,
        "processing_fee_amount": round(processing_fee_amount, 2),
        "late_penalty_pct": late_penalty_pct,
        "late_penalty_amount": round(late_penalty_amount, 2),
        "monthly_emi": round(monthly_emi, 2),
        "total_interest": round(total_interest, 2),
        "total_repayment": round(total_repayment, 2),
        "effective_annual_rate": round(effective_apr, 2),
        "repayment_multiplier": round(repayment_multiplier, 2),
        "danger_level": danger_level,
        "danger_label": danger_label,
        "assumptions_made": assumptions_made,
        "comparison_at_bank_rate": {
            "bank_rate_pct": 10.0,
            "bank_emi": round(bank_emi, 2),
            "bank_total_repayment": round(bank_total_repayment, 2),
            "bank_total_interest": round(bank_total_interest, 2),
            "extra_cost_vs_bank": round(extra_cost_vs_bank, 2),
        },
    }
