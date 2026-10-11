import React from "react";
import { Activity, ArrowRight, Heart, ShieldCheck, Stethoscope, UserCheck, CalendarCheck, Sparkles, Award } from "lucide-react";
import { ArogyaLogo } from "../components/ArogyaLogo";
import { InteractiveCard } from "../components/InteractiveCard";

interface LandingPageProps {
  onStartAssessment: () => void;
  onViewHistory: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onViewHistory
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[680px] h-[300px] bg-gradient-to-tr from-teal-500/12 via-sky-400/8 to-emerald-500/12 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Centered Brand Emblem */}
          <div className="flex flex-col items-center justify-center">
            <ArogyaLogo size="lg" variant="horizontal" />
          </div>

          {/* Hero Title & Description */}
          <div className="space-y-3 pt-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.14]">
              Your Health, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-900 via-teal-600 to-emerald-600 dark:from-teal-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Predicted Earlier.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Assess potential health risks using personal health metrics, medical history, family history, lifestyle factors, and laboratory markers. Receive actionable, personalized preventive guidance.
            </p>
          </div>

          {/* Animated Heartbeat ECG Line with Active Monitor Indicator */}
          <div className="max-w-md mx-auto py-1">
            <div className="relative h-14 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 px-6 backdrop-blur-xs shadow-xs">
              <svg viewBox="0 0 500 60" className="w-full h-full overflow-visible">
                <path
                  d="M 0 30 L 70 30 L 90 20 L 105 40 L 120 30 L 160 30 L 175 10 L 195 50 L 210 25 L 225 35 L 235 30 L 310 30 L 330 18 L 345 42 L 360 30 L 400 30 L 415 8 L 435 52 L 450 26 L 465 34 L 500 30"
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ecg-line"
                />
              </svg>
              <div className="absolute right-3.5 top-2.5 flex items-center gap-1.5 text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                <span className="hidden sm:inline">Active Health Monitor</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Activity className="w-5 h-5 text-teal-200" />
              <span>Start Risk Assessment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onViewHistory}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-slate-200 dark:border-slate-800 shadow-xs transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>View Assessment History</span>
            </button>
          </div>
        </div>
      </section>

      {/* Patient Healthcare Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InteractiveCard enableTilt={true} className="p-7 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Comprehensive Health Evaluation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates vital signs, lab markers, personal medical history, hereditary family history, and everyday lifestyle habits for complete cardiometabolic stratification.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span>Multimodal clinical inputs</span>
            </div>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-7 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clear &amp; Understandable Insights
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Translates complex machine learning risk predictions into an intuitive 0–100 index with transparent SHAP feature attributions in clear, non-technical language.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Explainable AI (SHAP)</span>
            </div>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-7 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Actionable Preventive Guidance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive prioritized lifestyle strategies, dietary recommendations, physical activity targets, and downloadable clinical PDF reports to discuss with your doctor.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Evidence-based guidance</span>
            </div>
          </InteractiveCard>
        </div>
      </section>

      {/* Patient Reassurance & Steps Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#10213A] to-teal-950 text-white border border-slate-800 shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
              <UserCheck className="w-4 h-4" />
              <span>Simple 5-Minute Healthcare Assessment</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
              Take Proactive Steps for Your Long-Term Wellness
            </h2>

            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Early awareness empowers effective prevention. Complete the guided assessment to evaluate your risk factors and download your personal clinical summary.
            </p>

            <div className="pt-2">
              <button
                onClick={onStartAssessment}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Begin Your Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
