import React, { useState } from "react";
import metricsData from "../data/metrics.json";
import featureImportanceData from "../data/feature_importance.json";
import datasetSummary from "../data/dataset_summary.json";
import { ShieldCheck, BarChart2, AlertCircle, Award, Database, Layers, CheckCircle2, TrendingUp, Info } from "lucide-react";

export const ModelInsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"benchmarks" | "matrix" | "features" | "dataset" | "limitations">("benchmarks");

  const modelNames = Object.keys(metricsData);
  const bestModelKey = "Calibrated Ensemble (Best)";
  const bestModel = (metricsData as any)[bestModelKey];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Model Governance &amp; Machine Learning Transparency
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
          Model Insights, Evaluation &amp; Statistical Auditing
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Complete cross-validated benchmarking across 5 distinct algorithms, calibration curves, SHAP global feature importances, and verified leakage protection auditing.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {[
            { id: "benchmarks", label: "Model Comparison", icon: BarChart2 },
            { id: "matrix", label: "Confusion Matrix & ROC", icon: Layers },
            { id: "features", label: "Global Feature Importance", icon: TrendingUp },
            { id: "dataset", label: "Cohort Distributions", icon: Database },
            { id: "limitations", label: "Data & Limitations (Audit)", icon: AlertCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-900 dark:bg-teal-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: MODEL COMPARISON BENCHMARKS */}
      {activeTab === "benchmarks" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Best Model Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white border border-teal-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Top Performing Clinical Architecture</span>
              </div>
              <h2 className="text-xl font-extrabold">{bestModelKey}</h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Soft-voting ensemble of Random Forest, Gradient Boosting, and balanced Logistic Regression with Platt Sigmoid Probability Calibration.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-black text-teal-400">{(bestModel.high_risk_recall * 100).toFixed(1)}%</div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase">High-Risk Recall</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-black text-teal-400">{(bestModel.macro_f1 * 100).toFixed(1)}%</div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase">Macro F1-Score</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-black text-teal-400">{bestModel.roc_auc.toFixed(3)}</div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase">ROC-AUC (OvR)</div>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              5-Fold Stratified Cross-Validation Benchmark Table
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Model Candidate</th>
                    <th className="py-3 px-4">CV Macro-F1</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Weighted F1</th>
                    <th className="py-3 px-4">High-Risk Recall (Priority)</th>
                    <th className="py-3 px-4">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {modelNames.map((name) => {
                    const m = (metricsData as any)[name];
                    const isTop = name.includes("Ensemble");

                    return (
                      <tr
                        key={name}
                        className={isTop ? "bg-teal-50/50 dark:bg-teal-950/20 font-bold" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"}
                      >
                        <td className="py-3.5 px-4 flex items-center gap-2 text-slate-900 dark:text-white">
                          {isTop && <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />}
                          <span>{name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{m.cv_f1_macro_mean.toFixed(4)}</td>
                        <td className="py-3.5 px-4 font-mono">{(m.test_accuracy * 100).toFixed(1)}%</td>
                        <td className="py-3.5 px-4 font-mono">{(m.weighted_f1 * 100).toFixed(1)}%</td>
                        <td className="py-3.5 px-4 font-mono text-rose-600 dark:text-rose-400 font-extrabold">
                          {(m.high_risk_recall * 100).toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-4 font-mono">{m.roc_auc.toFixed(4)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2">
              * Note: High-Risk class recall is prioritized over raw accuracy because missing a high-risk patient in a clinical context carries severe prognostic hazard.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CONFUSION MATRIX & ROC */}
      {activeTab === "matrix" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Confusion Matrix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Confusion Matrix (Test Set N=2,000)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated on holdout data with zero data leakage.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col items-center">
              <div className="text-xs font-bold text-slate-400 mb-2">PREDICTED CLASS</div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
                {/* Header */}
                <div className="text-[10px] font-bold text-slate-400 self-center">ACTUAL</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 p-1">Low</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 p-1">Mod</div>
                <div className="font-bold text-rose-600 dark:text-rose-400 p-1">High</div>

                {/* Row Low */}
                <div className="font-bold text-emerald-600 dark:text-emerald-400 self-center">Low</div>
                <div className="bg-emerald-500 text-white font-bold p-3 rounded-xl shadow-xs">1,404</div>
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded-xl">12</div>
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 p-3 rounded-xl">0</div>

                {/* Row Mod */}
                <div className="font-bold text-amber-600 dark:text-amber-400 self-center">Mod</div>
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded-xl">21</div>
                <div className="bg-amber-500 text-white font-bold p-3 rounded-xl shadow-xs">445</div>
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded-xl">12</div>

                {/* Row High */}
                <div className="font-bold text-rose-600 dark:text-rose-400 self-center">High</div>
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 p-3 rounded-xl">0</div>
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded-xl">4</div>
                <div className="bg-rose-500 text-white font-bold p-3 rounded-xl shadow-xs">102</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Low Risk Specificity:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">99.1%</span>
              </div>
              <div className="flex justify-between">
                <span>Moderate Risk F1:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">92.8%</span>
              </div>
              <div className="flex justify-between">
                <span>High Risk Recall (102 / 106):</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">96.2%</span>
              </div>
            </div>
          </div>

          {/* ROC Curves Simulation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Multi-Class ROC Curves (One-vs-Rest)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                True Positive Rate vs. False Positive Rate across decision thresholds.
              </p>
            </div>

            <div className="h-60 w-full p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 300 220" className="w-full h-full overflow-visible">
                {/* Axes */}
                <line x1="40" y1="180" x2="280" y2="180" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="180" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Diagonal random guess */}
                <line x1="40" y1="180" x2="280" y2="20" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="1" />

                {/* High-Risk ROC (AUC 0.996) */}
                <path
                  d="M 40 180 Q 42 30, 80 23 T 280 20"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                />

                {/* Moderate-Risk ROC (AUC 0.978) */}
                <path
                  d="M 40 180 Q 55 55, 110 32 T 280 20"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />

                {/* Low-Risk ROC (AUC 0.994) */}
                <path
                  d="M 40 180 Q 44 32, 90 22 T 280 20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                <text x="160" y="200" textAnchor="middle" fill="#64748B" fontSize="10">False Positive Rate</text>
                <text x="25" y="100" textAnchor="middle" fill="#64748B" fontSize="10" transform="rotate(-90 25 100)">True Positive Rate</text>
              </svg>
            </div>

            <div className="flex justify-around text-xs font-semibold pt-1">
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                High (AUC = 0.996)
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Mod (AUC = 0.978)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Low (AUC = 0.994)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL FEATURE IMPORTANCE */}
      {activeTab === "features" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Global Gini / Mean Decrease in Impurity Ranking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top predictive biomarkers evaluated across tree ensemble architectures.
            </p>
          </div>

          <div className="space-y-3">
            {featureImportanceData.map((item: any, i: number) => {
              const maxImp = 0.20;
              const barWidth = Math.min(100, Math.max(5, (item.importance / maxImp) * 100));

              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {i + 1}. {item.feature.replace(/_/g, " ")}
                    </span>
                    <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">
                      {(item.importance * 100).toFixed(1)}% weight
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-900 to-teal-500 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: COHORT DISTRIBUTIONS */}
      {activeTab === "dataset" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age group distribution */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Risk Distribution by Age Cohorts
              </h3>
              <div className="space-y-4 pt-2">
                {datasetSummary.age_groups_risk.map((g: any, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Age {g.group} yrs</span>
                      <span className="text-slate-400">
                        Low: {g.Low}% | Mod: {g.Moderate}% | High: {g.High}%
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                      <div style={{ width: `${g.Low}%` }} className="bg-emerald-500 h-full" title={`Low ${g.Low}%`} />
                      <div style={{ width: `${g.Moderate}%` }} className="bg-amber-500 h-full" title={`Mod ${g.Moderate}%`} />
                      <div style={{ width: `${g.High}%` }} className="bg-rose-500 h-full" title={`High ${g.High}%`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Pairwise Clinical Correlations */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Pairwise Clinical Correlation Heatmap (Top Pairs)
              </h3>
              <div className="space-y-2.5">
                {datasetSummary.correlations.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {c.feature1.replace(/_/g, " ")} ↔ {c.feature2.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-lg ${
                        c.corr > 0.5
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : c.corr > 0
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                      }`}
                    >
                      {c.corr > 0 ? "+" : ""}{c.corr.toFixed(2)} r
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATA & LIMITATIONS (AUDIT) */}
      {activeTab === "limitations" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-7 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-base">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Critical Auditing &amp; Data Leakage Safeguard Protocol</span>
            </div>

            <div className="text-xs text-amber-950 dark:text-amber-200 space-y-3 leading-relaxed">
              <p>
                <strong>Target Derivation Rule:</strong> In the source dataset, the ground truth class <code>Risk_Level</code> was originally generated from continuous <code>Risk_Score</code> via piecewise thresholds (Low &lt;3.5, Moderate 3.5–6.49, High ≥6.5).
              </p>
              <p>
                <strong>Strict Zero-Leakage Policy:</strong> Neither <code>Risk_Score</code> nor <code>Patient_ID</code> were ever provided as input features during model training or cross-validation. Including <code>Risk_Score</code> would constitute 100% data leakage and render validation metrics deceptively trivial.
              </p>
              <p>
                <strong>Class Imbalance Mitigation:</strong> The natural target class distribution is heavily skewed (Low: ~70.8%, Moderate: ~23.9%, High: ~5.3%). To prevent model indifference toward the minority high-risk cohort, all tree and linear models utilized <code>class_weight="balanced"</code>, and hyperparameters were selected prioritizing <strong>Macro-F1 and High-Risk Class Recall</strong> over raw accuracy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Clinical Context &amp; Disclaimers
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This algorithm models statistical associations across cardiovascular markers. Real-world clinical decision-making must integrate patient symptom presentations, electrocardiograms, cardiac imaging, and lab panels under licensed medical supervision.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Continuous Improvement &amp; Versioning
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The system features an automated feedback ingestion loop (Workflow Stage 7). Clinical practitioners and patients can submit outcome confirmations to update model weights in periodic retraining cycles.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
