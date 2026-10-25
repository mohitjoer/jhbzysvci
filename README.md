# Elexon WindIQ — UK Day-Ahead Wind Forecast Risk & Procurement Suite

> **Enterprise Decision Support System for UK Wholesale Power Trading Desks**  
> Empirically evaluating national wind forecast accuracy from Elexon BMRS (`WINDFOR`) against actuals (`FUELHH`) to support day-ahead wholesale electricity procurement decisions for January 2026.

---

## 1. How to Start the Application

### Option A: Using Docker Compose (Quickest & Recommended)

Ensure Docker and Docker Compose are installed and running on your system:

```bash
# 1. Build and start both backend and frontend containers
docker compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

To stop the services:
```bash
docker compose down
```

---

### Option B: Local Manual Setup (Development Mode)

#### Step 1: Start the Backend Service
The Python backend uses FastAPI and Uvicorn. Pre-packaged dependencies are included in `./backend/deps`:

```bash
# From the project root directory
PYTHONPATH=./backend/deps python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*The backend will initialize, load the January 2026 Elexon datasets into memory, and run on `http://localhost:8000`.*

#### Step 2: Start the Frontend Service
The frontend is built with React 19, TypeScript, Tailwind CSS, and Vite. In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite dev server automatically proxies `/api` calls to `http://localhost:8000`.*

---

### Step 3: Running Automated Tests

#### Backend Test Suite
Run the automated `unittest` suite verifying data loading, health endpoints, cutoff filter logic, and error metrics calculations:

```bash
PYTHONPATH=./backend/deps:. python3 tests/test_api.py
```
*Expected output: `Ran 5 tests in ~0.007s — OK`.*

#### Frontend Linting & Production Build
```bash
npm --prefix frontend run lint   # Oxlint code check: 0 warnings, 0 errors
npm --prefix frontend run build  # Vite production bundle build
```

---

## 2. Details of Files and Directories Present

Below is the complete project directory structure detailing the purpose and responsibility of every file and directory:

```
intern-project/
│
├── backend/                              # Python FastAPI Backend Service
│   ├── data/                             # Verified Elexon BMRS January 2026 Datasets
│   │   ├── actuals_jan2026.json          # Metered wind generation from FUELHH stream (1,536 half-hour SP records)
│   │   └── forecasts_jan2026.json        # Published wind forecasts from WINDFOR stream (18,688 records across D-1 runs)
│   ├── deps/                             # Pre-compiled local Python wheels and dependencies (FastAPI, Uvicorn, Pydantic, HTTPX)
│   ├── Dockerfile                        # Multi-stage containerization Dockerfile for the Python backend
│   ├── main.py                           # Core backend server: dataset caching, time-alignment, and /api/decision-dashboard API
│   └── requirements.txt                  # Python package specifications (fastapi, uvicorn, pydantic, httpx)
│
├── frontend/                             # React 19 + TypeScript + Vite + Tailwind CSS Frontend
│   ├── public/                           # Static assets served directly by the web server
│   │   ├── favicon.svg                   # Wind turbine browser tab icon
│   │   └── icons.svg                     # Vector icon symbols
│   ├── src/                              # Application source code
│   │   ├── assets/                       # Static media (logos, svgs)
│   │   ├── components/                   # Modular React UI components (One dashboard, 2 sections)
│   │   │   ├── DashboardHeader.tsx       # 1. Header controls: Jan 1-31 & Whole Month picker, D-1 09:20 cutoff, timezone badge
│   │   │   ├── InfoCards.tsx             # 2. Decision info cards: decision timestamp, publish timestamp used, avg/peak/lowest MW
│   │   │   ├── ForecastChart.tsx         # 3. Section 1 line chart: 48 half-hour slots, Line 1 forecast, Line 2 actual toggle, data gap audit
│   │   │   ├── MetricCards.tsx           # 4. Section 2 cards: MAE (average miss), Bias (over/under direction), RMSE, P90, P95
│   │   │   ├── BufferRecommendationBox.tsx # 5. High-contrast advice box: "Hold an extra X MW of buffer beyond forecast"
│   │   │   ├── ErrorCharts.tsx           # 6. Multi-view error visuals: Error over time, distribution histogram, scatter plot
│   │   │   ├── DetailsTable.tsx          # 7. Audit table: slot time, forecast MW, publish time, actual MW, error, with search filter
│   │   │   ├── AssumptionsFooter.tsx     # 8. Assumptions footer: EPEX SPOT 09:20 auction cutoff, GMT timezone, Elexon sources
│   │   │   └── MainDashboard.tsx         # Top-level orchestrator managing state, API queries, and component composition
│   │   ├── api.ts                        # TypeScript API client & interfaces connecting to the FastAPI backend
│   │   ├── App.tsx                       # Root React component mounting MainDashboard
│   │   ├── index.css                     # Tailwind CSS v3 directives and light-theme typography styles
│   │   └── main.jsx                      # Vite entry point mounting the React virtual DOM to #root
│   ├── Dockerfile                        # Multi-stage Docker build for frontend static assets
│   ├── nginx.conf                        # Production Nginx reverse proxy configuration for Docker deployments
│   ├── package.json                      # Node.js project manifest: scripts, React 19, Recharts, Lucide, Tailwind
│   ├── package-lock.json                 # Pinned deterministic dependency tree for Node packages
│   ├── postcss.config.js                 # PostCSS configuration for Tailwind CSS and Autoprefixer
│   ├── tailwind.config.js                # Tailwind CSS design system rules, colors, and slate palette
│   └── vite.config.ts                    # Vite dev server configuration and API reverse proxy (/api -> :8000)
│
├── tests/                                # Automated Test Harnesses
│   └── test_api.py                       # Python test suite testing health check, cutoff filters, histograms, and daily metrics
│
├── docker-compose.yml                    # Docker Compose file orchestrating backend (:8000) and frontend (:3000) services
├── Procfile                              # Process configuration for cloud platforms (Heroku / Render)
├── vercel.json                           # Configuration for Vercel deployment with serverless API rewrites
└── README.md                             # Project documentation, instructions, and architecture breakdown
```

---

## 3. Product Problem Statement & Scope

The client is an energy utility in Great Britain procuring electricity from the wholesale Day-Ahead power market to serve consumer demand.

### Business Challenges
1. **Intermittent Wind Procurement**: Wind generation is weather-dependent and non-dispatchable. To meet consumer load, the utility must calculate how much additional power must be procured (e.g., from dispatchable thermal/gas plants) beyond wind generation.
2. **Timing of Decisions**: Wholesale Day-Ahead market orders must be finalized on **Day D-1** before morning **Gate Closure** (specifically **09:20 UK time** for the EPEX SPOT UK 60-min auction). The desk must rely on forecasts available prior to this cutoff.
3. **Imbalance Penalties**: If wind generation is **over-forecasted**, the desk under-buys thermal power and falls short in real time, exposing the utility to severe imbalance cashout penalties in the Balancing Mechanism.

### Product Requirements (Addressed in the UI)
- **Requirement 1**: Understand the latest renewable generation forecasts available at decision time (Day D-1 morning cutoff).
- **Requirement 2**: Evaluate the accuracy of renewable generation forecasts quantitatively (MAE, Bias, RMSE, P90/P95) to inform procurement decisions with a quantified safety buffer.
- **Data Scope Limitation**: Exclusively uses national-level wind actuals (`FUELHH`, fuelType: "WIND") and forecasts (`WINDFOR`) from Elexon BMRS for **January 2026** (all 1,488 half-hour settlement periods).

---

## 4. Empirical January 2026 Trading Insights

Across all 31 delivery days of **January 2026**, analysis of gate-closure forecasts reveals:

| Metric | Result | Operational Meaning |
|---|---|---|
| **Systemic Bias** | **+1,851.9 MW** (Over-forecast) | Forecasts systematically over-predicted wind by ~1.85 GW on average. Utilities relying on raw forecasts were consistently short in real time. |
| **Mean Absolute Error (MAE)** | **2,145.2 MW** | The average half-hourly volume deviation between day-ahead auction expectations and actual meter outturn. |
| **Root Mean Square Error (RMSE)** | **2,615.8 MW** | Penalizes large, severe misses during sudden wind drop-offs. |
| **P90 Error Bound (Safety Buffer)** | **4,268 MW** | Holding an extra 4,268 MW buffer beyond raw forecast protects against shortfalls across 90% of all intervals. |
| **P95 Error Bound** | **5,339 MW** | High-protection buffer for extreme peak winter events. |

---

## 5. UI Layout Walkthrough (Top to Bottom)

The user interface implements a strict **light theme** layout matching the requirements:

1. **Title and Controls**:
   - Date picker for any day in January 2026, plus a **"★ Whole Month"** option.
   - Decision cutoff setting defaulting to **`09:20` UK time** on Day D-1 (user-changeable with quick presets for 09:20, 11:00, and 07:30).
   - Prominent badge: *"All times in UK time (GMT in January)"*.
2. **Info Cards (Section 1)**:
   - "Decision made on: 13 Jan, 09:20"
   - "Latest forecast used was published at: 13 Jan, 07:30" (the latest run published before the cutoff).
   - Average forecast, peak forecast, and lowest forecast in MW.
3. **Forecast vs Actual Chart (Section 1)**:
   - X-axis: 48 half-hour slots (`00:00` to `23:30`).
   - Y-axis: Wind power in MW.
   - Line 1 (Blue): Forecast available at decision time.
   - Line 2 (Emerald): Actual wind generation with an optional checkbox toggle.
   - Data gap warning banner (all 48 slots confirmed present).
4. **Metric Cards (Section 2)**:
   - MAE: Average miss in MW.
   - Bias: Directional miss indicator (`Over-forecast` vs. `Under-forecast`).
   - RMSE: Metric penalizing large misses.
   - P90 and P95 Error: Safety margin numbers.
5. **Buffer Recommendation Box**:
   - Highlighted callout box with plain advice:  
     > *"To be covered 90% of the time, hold an extra 1,681 MW of buffer beyond the forecast."* (or **4,268 MW** for Whole Month).
6. **Error Charts**:
   - **Error Over Time Chart**: Bar chart showing $(Forecast - Actual)$ for each slot centered around a zero line.
   - **Error Distribution Histogram**: Binned frequency distribution of small vs. large errors.
   - **Forecast vs Actual Scatter Plot**: Correlation plot with $1:1$ diagonal accuracy line.
7. **Details Table**:
   - Numerical audit table with slot time, settlement period, forecast MW, publish time used, actual MW, and error, with instant search and 48-period expansion.
8. **Assumptions and Data Notes Footer**:
   - Documents the **09:20 UK time** auction cutoff assumption, **GMT** timezone convention, and Elexon BMRS data streams.

---

## 6. Key Assumptions & Conventions

1. **Gate Closure Cutoff (`09:20 UK Time`)**: Corresponds to the EPEX SPOT UK 60-Minute Day-Ahead Auction deadline on Day D-1. Forecasts published after 09:20 cannot be used for auction bid submission.
2. **Timezone Standard**: All times are in **UK Time (GMT / UTC+0 in January)**.
3. **Half-Hour Alignment**: Hourly `WINDFOR` forecasts are mapped to the two corresponding half-hourly `FUELHH` settlement periods ($2H+1$ and $2H+2$).
