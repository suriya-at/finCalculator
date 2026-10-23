# FinCalc — Groww-Inspired Responsive Financial Calculator Suite

A modern, responsive, and precision-engineered financial calculator web application inspired by [Groww](https://groww.in/). Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**, featuring **25 fully functional calculators** covering Investments, Loans & EMIs, Income Tax, and Financial Planning.

---

## 🚀 Live Vercel Deployment

FinCalc is ready to deploy on **Vercel** with zero backend requirements:

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Client Routing: Preconfigured via `vercel.json` SPA rewrites

---

## 🌟 Key Features & Design Aesthetics

- **Groww-Inspired Design**: Clean modern UI with emerald green accents (`#00D09C`), subtle borders, soft shadows, and high-readability typography (`Inter`).
- **Zero-Latency Reactivity**: All calculations execute client-side instantly on every keystroke or slider movement without lag.
- **Dual Control Inputs**: Every parameter features dual controls — an interactive smooth range slider plus direct numeric input box with quick-preset chips (e.g., ₹25k, ₹50k, 10 yrs, etc.).
- **Indian Rupee Formatting (`₹`)**: Comprehensive Indian numbering system support (`₹25,000`, `₹50 Lakh`, `₹1.5 Crore`).
- **Interactive Visualizations**: Dynamic SVG Donut charts with breakdown percentages and center balance statistics.
- **Year-by-Year Amortization & Growth Tables**: Expandable annual schedules showing opening balance, principal paid, interest earned/paid, and closing balance.
- **Formula & Methodology Transparency**: Collapsible formula box on every calculator explaining the exact mathematical formula, definitions, and statutory rules.
- **Instant Search (`Ctrl + K` / `Cmd + K`)**: Modal search across all 25 calculators by name, acronym, keywords, and description.
- **Light & Dark Mode**: Persistent theme toggle with automatic OS preference detection.
- **100% Free & Private**: No cookies, no trackers, and zero personal financial data leaves the client browser.

---

## 📊 Complete Directory of 25 Calculators

### 1. Investment Calculators (11)

| Calculator | Description | Mathematical Formula |
| :--- | :--- | :--- |
| **SIP Calculator** | Monthly Systematic Investment Plan maturity projection | $M = P \times \frac{(1 + i)^n - 1}{i} \times (1 + i)$ |
| **Lumpsum Calculator** | Future returns on one-time mutual fund deposits | $M = P \times (1 + r)^t$ |
| **Mutual Fund Returns** | Compare SIP vs Lumpsum strategies side-by-side | Dual formula evaluation across matching tenures |
| **Step-Up SIP Calculator** | SIP with annual percentage top-up (e.g., 10% annual salary hike) | Annual geometric progression of monthly contributions |
| **CAGR Calculator** | Compound Annual Growth Rate for stocks and portfolios | $\text{CAGR} = \left(\frac{V_{\text{final}}}{V_{\text{initial}}}\right)^{\frac{1}{t}} - 1$ |
| **XIRR Calculator** | Extended Internal Rate of Return for irregular cash flows | Newton-Raphson approximation: $\sum \frac{C_i}{(1 + \text{rate})^{d_i - d_0 / 365}} = 0$ |
| **SWP Calculator** | Systematic Withdrawal Plan with capital depletion alerts | $B_m = B_{m-1} \times (1 + i) - W$ |
| **PPF Calculator** | Public Provident Fund with statutory 7.1% interest (EEE status) | 15-year annual compound model with ₹1.5L 80C cap |
| **EPF Calculator** | Employees’ Provident Fund with 8.25% interest and annual hike | 12% Employee + 3.67% Employer EPF compounding to age 58 |
| **FD Calculator** | Bank Fixed Deposit with standard quarterly compounding | $M = P \times \left(1 + \frac{r}{400}\right)^{4 \times t}$ |
| **RD Calculator** | Recurring Deposit with quarterly compounding formula | $M = \sum P \times \left(1 + \frac{r}{400}\right)^{4 \times (n - i) / 12}$ |

---

### 2. Loan & EMI Calculators (6)

| Calculator | Description | Mathematical Formula |
| :--- | :--- | :--- |
| **EMI Calculator** | Standard equated monthly installment with full amortization | $E = P \cdot r \cdot \frac{(1+r)^n}{(1+r)^n - 1}$ |
| **Home Loan Calculator** | Home financing with down payment and Sec 80C/24b tax perks | Principal amortisation + ₹2L Sec 24b + ₹1.5L 80C deductions |
| **Personal Loan Calculator** | Short-term financing with processing fees and APR breakdown | Exact net disbursement after processing fees |
| **Car Loan Calculator** | Auto financing with on-road pricing and down-payment split | Standard amortized loan on (Car Price - Down Payment) |
| **Loan Prepayment Calculator** | Savings in tenure or interest from lump sum prepayment | Recalculated amortization comparing original vs prepaid terms |
| **Loan Eligibility Calculator** | Maximum borrowing capacity based on FOIR (Fixed Obligation to Income Ratio) | Net Income $\times$ FOIR (50%) $-$ Existing EMIs |

---

### 3. Tax & Financial Planning Calculators (8)

| Calculator | Description | Mathematical Formula & Logic |
| :--- | :--- | :--- |
| **Income Tax Calculator** | FY 2024-25 / 2025-26 Old vs New Tax Regime comparison | Budget 2024 revised slabs, ₹75,000 std deduction, Sec 87A rebate |
| **Salary In-Hand Calculator** | Monthly take-home salary from Annual CTC | CTC minus Employer EPF, Employee EPF, Prof. Tax & TDS |
| **Inflation Calculator** | Future cost of living and purchasing power erosion | $F = P \times (1 + i)^t$, Equivalent = $P / (1 + i)^t$ |
| **Retirement Planning** | Target retirement corpus and required monthly SIP | Capitalization method adjusted for pre & post retirement inflation |
| **Gratuity Calculator** | Statutory gratuity under Payment of Gratuity Act 1972 | $\text{Gratuity} = \frac{15 \times \text{Last Drawn Basic} \times \text{Tenure}}{26}$ |
| **Simple Interest Calculator** | Non-compounding linear interest on deposits or loans | $\text{SI} = \frac{P \times R \times T}{100}$ |
| **Compound Interest** | Frequency-adjusted compound interest (Daily to Annual) | $A = P \times \left(1 + \frac{r}{100n}\right)^{nt}$ |
| **Percentage Calculator** | 4-in-1 tool (Percent of value, % Change, Markup/Discount) | $X\% \text{ of } Y = \frac{X \times Y}{100}$; $\Delta\% = \frac{Y - X}{X} \times 100$ |

---

## 🛠️ Project Structure

```
financial-calculators/
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # SVGs and styling assets
│   ├── components/
│   │   ├── calculators/    # Category calculators & master wrapper
│   │   │   ├── CalculatorWrapper.tsx
│   │   │   ├── InvestmentCalculators.tsx   # 11 Investment Calculators
│   │   │   ├── LoanCalculators.tsx         # 6 Loan Calculators
│   │   │   └── TaxAndPlanningCalculators.tsx # 8 Tax & Planning Calculators
│   │   └── common/         # Modular, reusable UI components
│   │       ├── DonutChart.tsx              # SVG breakdown chart
│   │       ├── Footer.tsx                  # 4-column comprehensive footer
│   │       ├── FormulaBox.tsx              # Collapsible math formula card
│   │       ├── Navbar.tsx                  # Sticky header, search, dark toggle
│   │       ├── ScheduleTable.tsx           # Amortization & growth tables
│   │       ├── SearchModal.tsx             # Real-time search modal
│   │       └── SliderInput.tsx             # Range slider + number input box
│   ├── context/
│   │   └── ThemeContext.tsx                # Light/Dark mode state & storage
│   ├── pages/
│   │   └── HomePage.tsx                    # Landing page with hero & grids
│   ├── types/
│   │   └── calculator.ts                   # TypeScript interfaces & types
│   ├── utils/
│   │   ├── calculators/                    # Isolated calculation engines
│   │   │   ├── investment.ts
│   │   │   ├── loans.ts
│   │   │   ├── taxAndPlanning.ts
│   │   │   ├── index.ts                    # Metadata registry & search
│   │   │   └── calculators.test.ts         # Vitest automated test suite (28 tests)
│   │   └── formatters.ts                   # INR (₹), Lakh, Crore formatters
│   ├── App.tsx                             # SPA hash router & layout
│   ├── index.css                           # Tailwind CSS & custom slider rules
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js / @tailwindcss/vite
├── tsconfig.json
├── vercel.json                             # Vercel deployment config
└── vite.config.ts
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ (tested on Node 20+)
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd financial-calculators

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Automated Tests
```bash
npm test
```
Runs 28 automated test cases covering edge cases (zero values, large amounts, boundary conditions) across all 25 calculators.

### Run Production Build
```bash
npm run build
```
Typechecks via `tsc -b` and builds optimized static assets into `dist/`.

### Run Preview Server
```bash
npm run preview
```

---

## 🚀 How to Deploy on Vercel

### Method 1: Deploy from GitHub (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set **Root Directory** to `financial-calculators` (if located within a monorepo or subfolder).
5. Framework Preset: **Vite** (auto-detected).
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click **Deploy**.

### Method 2: Deploy via Vercel CLI
```bash
cd financial-calculators
npm install -g vercel
vercel
```
Follow the interactive prompt, accept the default Vite settings, and your site will be live on a production `.vercel.app` domain.

---

## 📜 License
MIT License. Created for education, investment awareness, and financial planning.
