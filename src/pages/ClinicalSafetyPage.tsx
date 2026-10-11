import React from "react";
import {
  ShieldAlert, AlertTriangle, PhoneCall, Stethoscope, CheckCircle2,
  HelpCircle, Clock, FileWarning, ArrowRight, HeartPulse, Activity
} from "lucide-react";

interface ClinicalSafetyPageProps {
  onStartAssessment: () => void;
}

export const ClinicalSafetyPage: React.FC<ClinicalSafetyPageProps> = ({ onStartAssessment }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Clinical Safety &amp; Medical Guardrails</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Clinical Safety Guidelines
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Important principles regarding the clinical interpretation of risk scores, emergency indicators, and the essential role of qualified healthcare professionals.
        </p>
      </div>

      {/* Primary Medical Notice Ribbon */}
      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 space-y-2">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Core Medical Advisory</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          ArogyaAI provides educational risk assessments designed to foster proactive health awareness. It is <strong>NOT a diagnostic device</strong> and cannot diagnose, cure, or guarantee the prevention of any medical condition. Always discuss your assessment with a licensed healthcare provider before altering medications or treatment plans.
        </p>
      </div>

      {/* SECTION 1: How to Interpret Predicted Health Risk Levels */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. How to Interpret Predicted Health Risk Levels
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understanding the clinical meaning behind risk classifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Low Risk Classification</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Indicates that according to current epidemiological models, your personal biomarkers align with cohort averages that experience lower incidence of chronic cardiometabolic conditions. It is not an absolute guarantee against future illness.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Moderate Risk Classification</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Reflects identifiable sub-optimal parameters that warrant attention, such as pre-hypertension, physical inactivity, or borderline lipid levels. Targeted lifestyle adjustments frequently reverse these elevations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">High Risk Classification</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Signals that a constellation of critical vitals and medical history factors substantially increases vulnerability to cardiovascular or metabolic events. This calls for prompt clinical follow-up rather than self-management alone.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: When to Consult a Qualified Healthcare Professional */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. When to Consult a Qualified Healthcare Professional
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear thresholds and red-flag symptoms requiring urgent or emergency care.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Immediate Medical Attention (Seek Emergency Care)</span>
            </div>
            <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-1.5 list-disc pl-4">
              <li>Systolic blood pressure ≥ 180 mmHg or Diastolic blood pressure ≥ 120 mmHg (Hypertensive Crisis).</li>
              <li>Chest pressure, tightness, pain radiating to the left arm, neck, or jaw.</li>
              <li>Sudden numbness or weakness in the face, arm, or leg, especially on one side.</li>
              <li>Sudden difficulty speaking, confusion, or visual disturbances.</li>
              <li>Severe acute shortness of breath or resting heart rate exceeding 130 beats/minute.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Routine Clinical Follow-Up (Within 1–2 Weeks)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
              <li>High or Moderate risk prediction result without acute physical symptoms.</li>
              <li>Fasting blood glucose consistently reading above 125 mg/dL.</li>
              <li>Total cholesterol exceeding 240 mg/dL or persistent resting tachycardia.</li>
              <li>Strong hereditary family history of premature myocardial infarction or stroke.</li>
              <li>Before starting any strenuous new physical exercise regimen or radical dietary program.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: Limitations of AI-Based Health Risk Prediction */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <FileWarning className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. Limitations of AI-Based Health Risk Prediction
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear disclosure of technical boundaries and model scope.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Probabilistic Estimates Only</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Predictions represent statistical correlations observed in epidemiological health datasets. They cannot predict individual outcomes with certainty or account for unmeasured genetic, environmental, or psychological factors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Requires Accurate User Input</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Assessment accuracy depends directly on the truthfulness and precision of the self-reported inputs (recent blood pressure readings, laboratory panels, and lifestyle logs).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cannot Substitute Diagnostic Exams</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ArogyaAI does not replace clinical auscultation, 12-lead electrocardiograms (ECGs), echocardiography, coronary calcium scoring, or comprehensive blood pathology panels conducted by doctors.
            </p>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 border border-slate-800 shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Evaluate Your Personal Health Profile</h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
          Use ArogyaAI as a supportive wellness tool to understand your baseline indicators before your next routine doctor's appointment.
        </p>
        <button
          onClick={onStartAssessment}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Activity className="w-4 h-4 text-slate-950" />
          <span>Start Risk Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
