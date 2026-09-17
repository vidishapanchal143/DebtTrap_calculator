# 🛡️ DebtTrap Escape - Financial Literacy Loan Cost & APR Calculator

**DebtTrap Escape** is an empathetic, audio-first financial literacy application designed to protect informal borrowers, micro-entrepreneurs, and daily wage workers from deceptive interest rate traps, high-risk microloans, and illegal loan sharks.

It converts flat-rate interest claims and hidden fees into **True Annual Percentage Rates (APR)**, contrasts private loan costs directly with **Government Mudra Loans (PMMY @ 10%)**, and delivers plain-language explanations in **Hindi (हिन्दी)**, **Gujarati (ગુજરાતી)**, and **English**.

---

## ✨ Features

- 🧮 **Deterministic Loan Math Engine**: Accurately calculates Monthly EMI, Total Repayment, Total Interest, Repayment Multiplier (X times borrowed), and True Effective APR using Newton-Raphson Internal Rate of Return (IRR).
- 🚨 **Visual Risk Level Gauge**: Categorizes loans according to RBI microfinance risk guidelines (`LOW`, `MEDIUM`, `HIGH` / Predatory Trap).
- 🏛️ **Government Bank Benchmark**: Contrasts predatory loan costs with official 10% PMMY bank loans to calculate exact extra money lost.
- 🎙️ **Multi-Language Voice Assistant**: Supports Web Speech API input in Hindi, Gujarati, and English with smart Devnagari & Gujarati numeral parsing.
- 🤖 **AI Plain-Language Advice**: Uses Gemini 2.0 Flash (with offline fallback templates) for empathetic bullet-point guidance.
- 🔊 **Audio-First Text-to-Speech**: Speaks advice out loud for low-literacy users.
- 📊 **Dual Mode Interface**:
  - **Simple View**: Icon-first overview with key metrics.
  - **Detailed View**: Full financial metrics table and cost comparison graphs.
- 💬 **WhatsApp Share & PNG Download**: Share loan cost warnings on WhatsApp or download high-res summary card images.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: FastAPI (Python 3.13), Pydantic, Uvicorn, Newton-Raphson IRR math engine, Gemini 2.0 Flash API integration.
- **Frontend**: React 18, Vite, Vanilla CSS + TailwindCSS, Lucide Icons, html2canvas, Web Speech & SpeechSynthesis APIs.
- **Testing**: `pytest` test suite with 16 automated tests covering edge cases, loan sharks, fee traps, 120-month tenures, and API endpoints.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
The API will be available at `http://127.0.0.1:8000/api/calculate`.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Running Tests

```bash
# Run pytest unit & API test suite
pytest

# Run standalone math test script
python backend/calculator/test_loan_math.py

# Run standalone API endpoint test script
python test_api.py
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
