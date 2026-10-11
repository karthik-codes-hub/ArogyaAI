import React from "react";
import {
  FileText, Activity, Heart, ShieldCheck, Apple, Dumbbell, Moon,
  AlertTriangle, ArrowRight, CheckCircle2, Stethoscope, Droplets, Scale
} from "lucide-react";
import { InteractiveCard } from "../components/InteractiveCard";

interface PatientResourcesPageProps {
  onStartAssessment: () => void;
}

export const PatientResourcesPage: React.FC<PatientResourcesPageProps> = ({ onStartAssessment }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 sm:space-y-12 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>Patient Education &amp; Wellness Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Patient Healthcare Resources
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Clear, patient-friendly guidance on understanding your cardiovascular and metabolic risk markers, evidence-based lifestyle habits, and interpreting your health indicators.
        </p>
      </div>

      {/* SECTION 1: Understanding Your Health Risk Assessment */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              1. Understanding Your Health Risk Assessment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How health markers are analyzed to calculate your personalized risk category.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InteractiveCard enableTilt={true} className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Low Risk (Score &lt; 35)</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your vital signs, laboratory markers, and daily habits fall largely within recommended healthy ranges. Regular annual checkups and maintaining active habits are recommended.
            </p>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Moderate Risk (Score 35 – 64)</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              One or more cardiovascular or metabolic indicators (such as elevated blood pressure, borderline glucose, or low activity) are outside optimal ranges. Proactive lifestyle modifications help prevent escalation.
            </p>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">High Risk (Score ≥ 65)</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Several concurrent indicators suggest a heightened risk profile. We strongly advise scheduling a clinical consultation with your primary physician for comprehensive evaluation.
            </p>
          </InteractiveCard>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Proactive Screening:</strong> ArogyaAI evaluates 25 distinct health factors. Your risk score is a screening estimate of cardiovascular and metabolic vulnerability, intended to encourage timely conversations with doctors.
          </span>
        </div>
      </section>

      {/* SECTION 2: Preventive Healthcare and Healthy Lifestyle Tips */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              2. Preventive Healthcare &amp; Lifestyle Medicine Pillars
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-based everyday habits that substantially lower chronic disease risk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InteractiveCard enableTilt={true} className="p-5 space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Apple className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Balanced Nutrition</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Adopt a Mediterranean or DASH dietary pattern rich in whole grains, legumes, leafy vegetables, and lean proteins while minimizing sodium and ultra-processed sugars.
              </p>
            </div>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Dumbbell className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Regular Physical Activity</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Aim for at least 150 minutes of moderate aerobic exercise (brisk walking, cycling, swimming) each week, supplemented by 2 days of muscle-strengthening activities.
              </p>
            </div>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Moon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Restorative Sleep</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Maintain consistent sleep schedules targeting 7 to 8.5 hours per night. Chronic sleep deprivation elevates cortisol, blood pressure, and insulin resistance.
              </p>
            </div>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Substance Moderation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Avoid all forms of smoking and tobacco products. Limit alcohol intake and engage in daily stress-reduction techniques such as mindfulness or breathwork.
              </p>
            </div>
          </InteractiveCard>
        </div>
      </section>

      {/* SECTION 3: Understanding Your Vital Signs and Laboratory Results */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              3. Understanding Your Vital Signs and Laboratory Results
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clinical standard ranges for common vitals and laboratory biomarkers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Blood Pressure (Systolic / Diastolic)</h3>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">mmHg</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              • <strong>Normal:</strong> Less than 120 / 80 mmHg<br />
              • <strong>Elevated:</strong> 120–129 / &lt;80 mmHg<br />
              • <strong>Hypertension Stage 1:</strong> 130–139 / 80–89 mmHg<br />
              • <strong>Hypertension Stage 2:</strong> 140 or higher / 90 or higher mmHg
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fasting Blood Glucose</h3>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">mg/dL</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              • <strong>Normal:</strong> 70 to 99 mg/dL<br />
              • <strong>Pre-diabetes:</strong> 100 to 125 mg/dL<br />
              • <strong>Diabetes threshold:</strong> 126 mg/dL or higher on two separate tests
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Total Serum Cholesterol</h3>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">mg/dL</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              • <strong>Desirable:</strong> Less than 200 mg/dL<br />
              • <strong>Borderline High:</strong> 200 to 239 mg/dL<br />
              • <strong>High:</strong> 240 mg/dL or higher
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Body Mass Index (BMI)</h3>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">kg/m²</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              • <strong>Underweight:</strong> Under 18.5 kg/m²<br />
              • <strong>Normal weight:</strong> 18.5 to 24.9 kg/m²<br />
              • <strong>Overweight:</strong> 25.0 to 29.9 kg/m²<br />
              • <strong>Obese:</strong> 30.0 kg/m² or higher
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 text-white text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Check Your Health Profile?</h2>
        <p className="text-teal-100 max-w-xl mx-auto text-sm leading-relaxed">
          Complete our quick, confidential assessment to obtain an immediate risk classification and download your personal clinical summary.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartAssessment}
            className="px-7 py-3.5 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-extrabold text-sm shadow-md transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
          >
            <Activity className="w-4.5 h-4.5 text-teal-700" />
            <span>Start Health Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
