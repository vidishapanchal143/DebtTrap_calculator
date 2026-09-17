"""
DebtTrap Escape - FastAPI Backend Application
Handles loan calculations deterministically and delegates text explanation to Gemini / fallback.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from calculator.loan_math import calculate_loan_details
from explain.gemini_explainer import generate_loan_explanation

app = FastAPI(
    title="DebtTrap Escape API",
    description="Financial literacy API for loan cost analysis and AI plain-language explanations.",
    version="1.0.0"
)

# CORS configuration to allow local Vite frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanRequest(BaseModel):
    principal: float = Field(..., gt=0, description="Principal loan amount in INR (₹)")
    rate: float = Field(..., ge=0, description="Stated interest rate percentage")
    rate_type: str = Field("annual", description="Rate type: 'monthly', 'annual', or 'not_sure'")
    tenure_months: int = Field(12, gt=0, description="Tenure duration in months")
    repayment_type: str = Field("flat", description="Repayment method: 'flat', 'reducing', or 'not_sure'")
    processing_fee_pct: float = Field(0.0, ge=0.0, description="Optional processing fee percentage")
    late_penalty_pct: float = Field(0.0, ge=0.0, description="Optional late penalty percentage")
    lang: str = Field("hi", description="Output explanation language: 'hi' (Hindi), 'gu' (Gujarati), 'en' (English)")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "DebtTrap Escape API"}

@app.post("/api/calculate")
def calculate_and_explain(req: LoanRequest):
    try:
        # Step 1: Perform pure deterministic math
        loan_result = calculate_loan_details(
            principal=req.principal,
            rate=req.rate,
            rate_type=req.rate_type,
            tenure_months=req.tenure_months,
            repayment_type=req.repayment_type,
            processing_fee_pct=req.processing_fee_pct,
            late_penalty_pct=req.late_penalty_pct,
        )

        # Step 2: Pass calculated numbers to Gemini explainer (or fallback)
        ai_result = generate_loan_explanation(loan_result, lang=req.lang)

        return {
            "success": True,
            "data": loan_result,
            "ai_explanation": ai_result["explanation"],
            "explanation_source": ai_result["source"],
            "explanation_message": ai_result["message"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
