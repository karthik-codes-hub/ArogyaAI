import React, { useState } from "react";
import { Database, Cpu, Cog, Activity, Monitor, Server, RefreshCw, CheckCircle, ArrowRight, Layers, FileCode } from "lucide-react";

export const WorkflowPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(1);

  const stages = [
    {
      id: 1,
      title: "1. Data Sources",
      icon: Database,
      badge: "Ingestion",
      color: "from-blue-600 to-cyan-600",
      summary: "Collection of diverse clinical, demographic, lifestyle, and lab parameters.",
      inputs: ["Age, Gender, Location", "Blood Pressure, Diabetes, Cholesterol, Heart Disease, Stroke", "Smoking, Alcohol, Exercise, Diet, Sleep", "BMI, Resting Heart Rate, Fasting Blood Glucose"],
      implementation: "AI_Healthcare_Risk_Dataset.csv (10,000 patient records across 27 distinct columns)",
      files: ["AI_Healthcare_Risk_Dataset.csv", "generate_dataset.cjs"],
      technicalDetails: "Real & synthetic cohort synthesis with validated population-level joint distributions, containing realistic class imbalance (70.8% Low, 23.9% Moderate, 5.3% High)."
    },
    {
      id: 2,
      title: "2. Data Preprocessing",
      icon: Cog,
      badge: "Preparation",
      color: "from-amber-600 to-orange-600",
      summary: "Robust median/mode imputation, clinical domain clipping, categorical transformation, and feature engineering.",
      inputs: ["Missing values handling (~200 per column)", "Outlier clipping (BP: 70-250, Glucose: 40-350, BMI: 10-60)", "One-hot & ordinal encodings", "Feature engineering (Pulse pressure, BP category, BMI category, metabolic score, lifestyle score)"],
      implementation: "train.py & src/services/riskModel.ts",
      files: ["train.py", "src/services/riskModel.ts", "evaluate_pipeline.cjs"],
      technicalDetails: "Zero-leakage enforcement strictly drops Risk_Score and Patient_ID prior to transformer pipeline fits. Preprocessing logic is mirrored identically between training and production inference."
    },
    {
      id: 3,
      title: "3. Model Development",
      icon: Cpu,
      badge: "Training & Validation",
      color: "from-emerald-600 to-teal-600",
      summary: "5-fold stratified cross-validation across multiple algorithms with Platt probability calibration.",
      inputs: ["Logistic Regression (balanced)", "Decision Tree Classifier", "Random Forest Classifier", "XGBoost / Gradient Boosting", "Soft-Voting Ensemble with CalibratedClassifierCV"],
      implementation: "train.py (Model comparison, hyperparameter optimization, and calibration)",
      files: ["train.py", "src/data/metrics.json", "src/data/feature_importance.json"],
      technicalDetails: "Metric priority selects by Macro-F1 with High-Risk Class Recall as tie-breaker (achieving 96.2% recall on holdout high-risk cases with 0.996 ROC-AUC)."
    },
    {
      id: 4,
      title: "4. Prediction & Classification",
      icon: Activity,
      badge: "Inference Engine",
      color: "from-purple-600 to-indigo-600",
      summary: "Live user input ingestion, standardized feature extraction, calibrated probability distribution calculation, and safety guardrails.",
      inputs: ["Web form inputs & interactive sliders", "Real-time transformation", "Calibrated model inference", "AHA/ADA clinical safety guardrails"],
      implementation: "src/services/riskModel.ts & server.ts /api/predict",
      files: ["src/services/riskModel.ts", "server.ts", "backend/main.py"],
      technicalDetails: "Clinical guardrails provide instant safety overrides for hypertensive crisis (SBP ≥180 / DBP ≥120) and extreme hyperglycemia (>250 mg/dL) regardless of raw model classification."
    },
    {
      id: 5,
      title: "5. Output & User Interface",
      icon: Monitor,
      badge: "Clinical Experience",
      color: "from-rose-600 to-pink-600",
      summary: "Best-in-class responsive interface with radial gauge, SHAP waterfall explanation, What-If simulator, and PDF clinical reports.",
      inputs: ["Risk classification & confidence percentages", "SHAP directional factor waterfall", "Prioritized personalized interventions", "Downloadable medical PDF report with persistent disclaimer"],
      implementation: "React 19 + Tailwind CSS + Framer Motion + jsPDF",
      files: ["src/components/RadialGauge.tsx", "src/components/ShapWaterfall.tsx", "src/components/WhatIfSimulator.tsx", "src/components/PDFReportGenerator.ts"],
      technicalDetails: "WCAG 2.2 AA accessible, light/dark mode support, keyboard navigable command palette (Cmd+K), and zero cookie tracking."
    },
    {
      id: 6,
      title: "6. Production Deployment",
      icon: Server,
      badge: "Full-Stack System",
      color: "from-blue-700 to-indigo-800",
      summary: "Full-stack web application running Express + Vite on port 3000 alongside standalone FastAPI and Docker options.",
      inputs: ["Express REST API with full endpoints", "Vite middleware mounting for live preview", "FastAPI Python backend (backend/main.py)", "Docker & docker-compose configurations"],
      implementation: "server.ts, backend/main.py, Dockerfile, docker-compose.yml",
      files: ["server.ts", "backend/main.py", "backend/models.py", "Dockerfile", "docker-compose.yml"],
      technicalDetails: "Designed for cloud container runtimes (Cloud Run, Render, Railway, Vercel) with <5ms inference latency and .env.example configuration."
    },
    {
      id: 7,
      title: "7. Feedback & Continuous Improvement",
      icon: RefreshCw,
      badge: "Lifecycle Loop",
      color: "from-teal-600 to-emerald-700",
      summary: "Practitioner and user feedback capture with token-protected automated model retraining and versioning.",
      inputs: ["User star ratings (1-5)", "Physician actual diagnostic outcome verification", "Feedback comment storage", "Simulated retraining incorporating user outcomes"],
      implementation: "POST /api/feedback & POST /api/retrain",
      files: ["src/pages/FeedbackPage.tsx", "server.ts", "backend/main.py"],
      technicalDetails: "Stores outcome confirmations anonymously and versions model weights (v1.0.0 → v1.1.0) while preserving clinical benchmarks."
    }
  ];

  const current = stages[selectedStage - 1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Architecture Blueprint
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
          7-Stage End-to-End System Architecture
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Visual interactive representation mapping the entire machine learning lifecycle from clinical data sources to continuous feedback retraining. Click any stage to inspect its technical implementation.
        </p>
      </div>

      {/* Horizontal Interactive Pipeline Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((st) => {
          const Icon = st.icon;
          const isSelected = selectedStage === st.id;

          return (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-900 text-white border-blue-900 dark:bg-teal-500 dark:border-teal-500 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div>
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center mb-2 text-xs font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs line-clamp-1">{st.title.split(". ")[1]}</h4>
              </div>
              <span className={`text-[10px] font-semibold mt-2 block ${isSelected ? "text-teal-200" : "text-slate-400"}`}>
                Stage {st.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Showcase Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${current.color} text-white flex items-center justify-center shadow-sm`}>
              <current.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {current.badge}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Stage {current.id}: {current.title.split(". ")[1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedStage((prev) => Math.max(1, prev - 1))}
              disabled={selectedStage === 1}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setSelectedStage((prev) => Math.min(7, prev + 1))}
              disabled={selectedStage === 7}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {current.summary}
        </p>

        {/* 2-Column Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Operations / Inputs */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Core Operations &amp; Inputs</span>
            </h4>
            <ul className="space-y-2">
              {current.inputs.map((inp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Files & Implementations */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-teal-500" />
              <span>Repository Implementation Files</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {current.files.map((f, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  {f}
                </span>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Technical Note: </strong>
              {current.technicalDetails}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
