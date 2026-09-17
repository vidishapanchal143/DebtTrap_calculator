"""
Gemini API Explainer for DebtTrap Escape.
Generates plain-language, empathetic financial literacy explanations in Hindi, Gujarati, or English.
Falls back to pre-written templates if API key is missing or call fails.
"""
import os
import json

# Pre-written localized fallback explanations
FALLBACK_EXPLANATIONS = {
    "hi": {
        "summary": "आप ₹{principal:,} ले रहे हैं और कुल ₹{total_repayment:,} वापस करेंगे ({multiplier} गुना)।",
        "comparison": "आप बैंक के मुकाबले ₹{extra_cost:,} ज्यादा दे रहे हैं — जो आपके घर के लगभग {grocery_months} महीने के राशन के बराबर है!",
        "alternative": "व्यापार या पर्सनल काम के लिए पीएम मुद्रा योजना (PM Mudra Yojana) या नजदीकी सरकारी बैंक से 10% की सुरक्षित दर पर लोन लें।"
    },
    "gu": {
        "summary": "તમે ₹{principal:,} લો છો અને કુલ ₹{total_repayment:,} પાછા આપશો ({multiplier} ગણા).",
        "comparison": "તમે બેંક કરતા ₹{extra_cost:,} વધુ ચૂકવો છો — જે તમારા ઘરના લગભગ {grocery_months} મહિનાના કરિયાણા જેટલું છે!",
        "alternative": "વેપાર કે વ્યક્તિગત જરૂરિયાત માટે પીએમ મુદ્રા યોજના (PM Mudra Yojana) અથવા નજીકની સરકારી બેંકમાંથી 10% ના સુરક્ષિત દરે લોન લો."
    },
    "en": {
        "summary": "You are taking ₹{principal:,} and will pay back ₹{total_repayment:,} in total ({multiplier}x).",
        "comparison": "You are paying ₹{extra_cost:,} extra compared to a standard bank — equal to about {grocery_months} months of household groceries!",
        "alternative": "For business or personal needs, consider PM Mudra Yojana or your nearest government bank at a safe ~10% interest rate."
    }
}

def generate_fallback_explanation(loan_data: dict, lang: str = "hi") -> str:
    lang_code = lang if lang in FALLBACK_EXPLANATIONS else "hi"
    tpl = FALLBACK_EXPLANATIONS[lang_code]
    
    principal = int(loan_data.get("principal", 0))
    total_repayment = int(loan_data.get("total_repayment", 0))
    multiplier = loan_data.get("repayment_multiplier", 1.0)
    bank_comp = loan_data.get("comparison_at_bank_rate", {})
    extra_cost = int(bank_comp.get("extra_cost_vs_bank", 0))
    
    part1 = tpl["summary"].format(principal=principal, total_repayment=total_repayment, multiplier=multiplier)

    if extra_cost <= 0:
        if lang_code == "gu":
            part2 = "આ લોનનો દર સરકારી બેંકના સમાન અથવા ઓછો છે (કોઈ વધારાનો બોજ નથી)."
        elif lang_code == "en":
            part2 = "This loan rate is comparable to or lower than a standard bank (no extra penalty)."
        else:
            part2 = "यह लोन दर सरकारी बैंक के समान या कम है (कोई अतिरिक्त बोझ नहीं)।"
    else:
        grocery_months = max(1, round(extra_cost / 3000))
        part2 = tpl["comparison"].format(extra_cost=extra_cost, grocery_months=grocery_months)

    part3 = tpl["alternative"]
    
    return f"1. {part1}\n2. {part2}\n3. {part3}"

def generate_loan_explanation(loan_data: dict, lang: str = "hi") -> dict:
    """
    Calls Gemini free-tier API to generate plain-language explanation.
    Returns dict with explanation text and source ("gemini" or "fallback").
    """
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    
    if not api_key:
        return {
            "explanation": generate_fallback_explanation(loan_data, lang),
            "source": "fallback",
            "message": "Using local offline explanation (GEMINI_API_KEY not configured)."
        }
    
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("[GeminiExplainer Warning] google-genai package not installed. Falling back to template.")
        return {
            "explanation": generate_fallback_explanation(loan_data, lang),
            "source": "fallback",
            "message": "Using local offline explanation (google-genai package not installed)."
        }

    lang_names = {
        "hi": "Hindi",
        "gu": "Gujarati",
        "en": "English"
    }
    target_language = lang_names.get(lang, "Hindi")
    
    system_instruction = (
        f"You are a caring financial literacy assistant explaining loan terms to a low-literacy user in {target_language}. "
        "You are given pre-calculated numbers — never invent or recalculate any number. "
        "Respond in 3 short bullet points:\n"
        "(1) one-line plain-language summary of what they'll actually pay back,\n"
        "(2) a relatable real-life comparison (e.g. equivalent to X months of groceries based on extra interest paid vs bank),\n"
        "(3) one safe alternative (mention PM Mudra Yojana for business needs, or nearest bank/NBFC).\n"
        "Never shame the user. Keep total response under 80 words."
    )
    
    prompt_content = f"""
    LOAN DATA:
    - Principal Amount: ₹{loan_data.get('principal')}
    - Total Repayment: ₹{loan_data.get('total_repayment')}
    - Total Interest: ₹{loan_data.get('total_interest')}
    - Monthly EMI: ₹{loan_data.get('monthly_emi')}
    - Effective Annual Interest Rate (APR): {loan_data.get('effective_annual_rate')}%
    - Repayment Multiplier: {loan_data.get('repayment_multiplier')}x
    - Danger Level: {loan_data.get('danger_level')} ({loan_data.get('danger_label')})
    - Bank Benchmark Repayment (10% rate): ₹{loan_data.get('comparison_at_bank_rate', {}).get('bank_total_repayment')}
    - Extra Cost vs Bank: ₹{loan_data.get('comparison_at_bank_rate', {}).get('extra_cost_vs_bank')}
    - Language requested: {target_language}
    """
    
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt_content,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
                max_output_tokens=250,
            )
        )
        if response.text:
            return {
                "explanation": response.text.strip(),
                "source": "gemini",
                "message": "AI explanation generated successfully."
            }
        else:
            raise ValueError("Empty response from Gemini")
            
    except Exception as e:
        print(f"[GeminiExplainer Warning] API call failed ({str(e)}). Falling back to template.")
        return {
            "explanation": generate_fallback_explanation(loan_data, lang),
            "source": "fallback",
            "message": f"AI unavailable ({str(e)}). Served offline explanation."
        }
