import React, { useState } from "react";
import { PredictionResult, evaluateFamilyAlerts } from "../services/riskModel.ts";
import { RadialGauge } from "../components/RadialGauge";
import { ShapWaterfall } from "../components/ShapWaterfall";
import { generatePatientPDFReport } from "../components/PDFReportGenerator";
import {
  Download, Share2, AlertTriangle, HeartPulse, RefreshCw,
  PhoneCall, ShieldCheck, Check, Calendar, MapPin, User, AlertCircle, Users
} from "lucide-react";

interface ResultsPageProps {
  result: PredictionResult;
  onModifyAssessment: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onModifyAssessment
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const p = result.patient_input;

  const handleShare = () => {
    const patientName = p.Patient_Name ? `${p.Patient_Name}'s ` : "";
    const summary = `ArogyaAI Health Assessment (${result.id}): ${patientName}${result.risk_level} Risk (Health Index: ${result.risk_score_estimate}/100). Estimated confidence: Low ${(result.probabilities.Low * 100).toFixed(0)}%, Mod ${(result.probabilities.Moderate * 100).toFixed(0)}%, High ${(result.probabilities.High * 100).toFixed(0)}%.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isHighRisk = result.risk_level === "High";
  const hasGuardrailAlert = result.clinical_warnings.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header & Patient Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Assessment Summary
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              {result.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Personal Health Risk Assessment Report
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl">
              <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{p.Patient_Name || "Patient"}</span>
              <span className="text-slate-400">•</span>
              <span>{p.Age ? `${p.Age} yrs` : "N/A"}</span>
              <span className="text-slate-400">•</span>
              <span>{p.Gender || "N/A"}</span>
            </span>
            {p.Location && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {p.Location}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => generatePatientPDFReport(result)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Clinical PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "Copied Summary" : "Share"}</span>
          </button>

          <button
            onClick={onModifyAssessment}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Modify Inputs</span>
          </button>
        </div>
      </div>

      {/* Early Warning Alert Banner (High Risk or Clinical Emergency Guardrail) */}
      {(isHighRisk || hasGuardrailAlert) && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-900 shadow-md space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500 text-white shrink-0 shadow-sm animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-rose-900 dark:text-rose-200">
                {hasGuardrailAlert
                  ? result.clinical_warnings[0].title
                  : "Elevated Health Risk Detected"}
              </h2>
              <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                {hasGuardrailAlert
                  ? result.clinical_warnings[0].message
                  : "Your biomarker readings and health profile indicate an elevated risk category. Proactive medical evaluation is recommended."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Consult Physician / Emergency Care</span>
                </a>
                <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
                  {hasGuardrailAlert
                    ? result.clinical_warnings[0].action
                    : "Schedule a comprehensive clinical consultation with your primary physician."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Family-History & Compound Risk Alerts Section */}
      {(() => {
        const familyAlerts = result.family_alerts || evaluateFamilyAlerts(p);
        return (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Family-History &amp; Genetic Risk Alerts
                  </h2>
                  <p className="text-xs text-slate-500">
                    Compound risk evaluation combining your personal clinical metrics with inherited family medical history.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                {familyAlerts.length} Alert{familyAlerts.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {familyAlerts.map((alert, idx) => {
                const isHighSev = alert.severity === "high";
                const isModSev = alert.severity === "moderate";
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isHighSev
                        ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-950 dark:text-rose-200"
                        : isModSev
                        ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-200"
                        : "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isHighSev
                            ? "bg-rose-600 text-white"
                            : isModSev
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {isHighSev ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : isModSev ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-extrabold text-sm">
                            {alert.title}
                          </h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isHighSev
                                ? "bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-100"
                                : isModSev
                                ? "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-100"
                                : "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100"
                            }`}
                          >
                            {alert.severity === "high" ? "High Genetic Risk" : alert.severity === "moderate" ? "Moderate Alert" : "Normal / Baseline"}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                          {alert.message}
                        </p>
                        {alert.action && (
                          <p className="text-[11px] pt-1 opacity-90 font-semibold flex items-center gap-1.5">
                            <span>Recommended Action:</span>
                            <span className="underline">{alert.action}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              Note: This is an educational risk prediction and not a formal medical diagnosis. Always consult a licensed physician or specialist for diagnostic interpretation.
            </p>
          </div>
        );
      })()}

      {/* Main Analysis Section: Gauge + Vitals Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radial Speedometer Gauge */}
        <div className="lg:col-span-5">
          <RadialGauge
            score={result.risk_score_estimate}
            riskLevel={result.risk_level}
            probabilities={result.probabilities}
          />
        </div>

        {/* Patient Vitals & Risk Metrics Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Biomarker &amp; Vital Measurements Summary</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Lifestyle Score: {result.lifestyle_score}/10
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Blood Pressure</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {p.Systolic_BP}/{p.Diastolic_BP}
              </span>
              <span className="text-[10px] text-slate-500 block">{result.bp_category.label}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Body Mass Index</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {p.BMI.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">{result.bmi_category.label.split("(")[0]}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Fasting Glucose</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {p.Blood_Glucose}
              </span>
              <span className="text-[10px] text-slate-500 block">mg/dL</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Serum Cholesterol</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {p.Cholesterol}
              </span>
              <span className="text-[10px] text-slate-500 block">mg/dL</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Resting Heart Rate</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {p.Heart_Rate}
              </span>
              <span className="text-[10px] text-slate-500 block">beats/min</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Co-occurring Risks</span>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {result.metabolic_risk_count}
              </span>
              <span className="text-[10px] text-slate-500 block">metabolic indicators</span>
            </div>
          </div>

          {/* Patient-Centered Clinical Interpretation */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 text-xs text-teal-950 dark:text-teal-200 space-y-2 leading-relaxed">
            <span className="font-bold flex items-center gap-1.5 text-sm text-teal-900 dark:text-teal-300">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Clinical Health Evaluation Summary
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              {p.Patient_Name ? <strong>{p.Patient_Name}: </strong> : null}
              Based on your clinical vital signs, metabolic parameters, and reported health history, your current health status is estimated at <strong>{result.risk_level} Risk</strong> (Health Index: {result.risk_score_estimate}/100).
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">
              <strong>Medical Disclaimer:</strong> This assessment is an automated preventive screening estimate. It is not a clinical medical diagnosis or a substitute for professional healthcare advice. Please share this report with your physician during your next checkup.
            </p>
          </div>
        </div>
      </div>

      {/* Key Health Factor Drivers */}
      <ShapWaterfall factors={result.top_factors} />

      {/* Actionable Personalized Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Personalized Preventive Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evidence-based lifestyle strategies prioritized to help lower your health risks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.recommendations.map((rec: { priority: "Urgent" | "High" | "Medium" | "Preventive"; category: string; title: string; description: string }, idx: number) => {
            const badgeColor: Record<"Urgent" | "High" | "Medium" | "Preventive", string> = {
              Urgent: "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800",
              High: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800",
              Medium: "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800",
              Preventive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
            };

            const selectedColor = badgeColor[rec.priority] || badgeColor.Medium;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${selectedColor}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{rec.category}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {rec.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
