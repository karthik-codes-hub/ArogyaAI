import React, { useState, useMemo } from "react";
import { PatientInput, predictRisk, PredictionResult } from "../services/riskModel.ts";
import { Sparkles, ArrowRight, RotateCcw, TrendingDown } from "lucide-react";

interface WhatIfSimulatorProps {
  originalInput: PatientInput;
  originalResult: PredictionResult;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  originalInput,
  originalResult
}) => {
  // Lever states (keyboard-editable numeric inputs)
  const [systolicReduction, setSystolicReduction] = useState<number>(0); // 0 to 30 mmHg reduction
  const [bmiReduction, setBmiReduction] = useState<number>(0); // 0 to 8 kg/m2 reduction
  const [extraExerciseDays, setExtraExerciseDays] = useState<number>(0); // 0 to 4 days extra
  const [quitSmoking, setQuitSmoking] = useState<boolean>(false);
  const [improveDiet, setImproveDiet] = useState<boolean>(false);

  // Reset simulator
  const handleReset = () => {
    setSystolicReduction(0);
    setBmiReduction(0);
    setExtraExerciseDays(0);
    setQuitSmoking(false);
    setImproveDiet(false);
  };

  // Compute simulated patient input
  const simulatedInput = useMemo<PatientInput>(() => {
    const next = { ...originalInput };

    next.Systolic_BP = Math.max(90, originalInput.Systolic_BP - systolicReduction);
    next.BMI = Math.max(18.5, Math.round((originalInput.BMI - bmiReduction) * 10) / 10);
    next.Physical_Activity_Days = Math.min(7, originalInput.Physical_Activity_Days + extraExerciseDays);

    if (quitSmoking && originalInput.Smoking_Status === "Current") {
      next.Smoking_Status = "Former";
    }

    if (improveDiet) {
      next.Diet_Quality = "Good";
    }

    return next;
  }, [originalInput, systolicReduction, bmiReduction, extraExerciseDays, quitSmoking, improveDiet]);

  // Compute live prediction
  const simulatedResult = useMemo(() => {
    return predictRisk(simulatedInput);
  }, [simulatedInput]);

  const scoreDelta = Math.round((simulatedResult.risk_score_estimate - originalResult.risk_score_estimate) * 10) / 10;
  const isImproved = scoreDelta < 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold tracking-tight">Interactive "What-If" Health Simulator</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulate actionable clinical and lifestyle modifications via precise keyboard entry to visualize immediate risk reduction.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Levers</span>
        </button>
      </div>

      {/* Before vs After Impact Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Current Baseline</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold">{originalResult.risk_score_estimate}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                originalResult.risk_level === "High"
                  ? "bg-rose-950 text-rose-300 border border-rose-800"
                  : originalResult.risk_level === "Moderate"
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-800"
              }`}
            >
              {originalResult.risk_level} Risk
            </span>
          </div>
        </div>

        <div className="flex sm:justify-center items-center gap-2">
          <ArrowRight className="w-5 h-5 text-teal-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Projected Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-teal-300">
                {simulatedResult.risk_score_estimate}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  simulatedResult.risk_level === "High"
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : simulatedResult.risk_level === "Moderate"
                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {simulatedResult.risk_level} Risk
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end justify-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Net Improvement</span>
          <div className="flex items-center gap-1.5 mt-1">
            {isImproved ? (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>{Math.abs(scoreDelta)} pts reduction</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Adjust levers below</span>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Levers (Keyboard-Editable Numeric Inputs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lever 1: Blood Pressure Reduction */}
        <div className="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-200">Lower Systolic BP</span>
            <span className="font-mono text-teal-400 font-bold">
              ({simulatedInput.Systolic_BP} mmHg)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="30"
              step="1"
              value={systolicReduction}
              onChange={(e) => setSystolicReduction(Math.max(0, Math.min(30, Number(e.target.value))))}
              className="w-32 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            />
            <span className="text-xs text-slate-300 font-medium">mmHg reduction</span>
          </div>
          <p className="text-xs text-slate-400">
            Achievable via DASH dietary pattern, sodium control, and prescribed antihypertensives.
          </p>
        </div>

        {/* Lever 2: BMI Weight Loss */}
        <div className="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-200">BMI Weight Reduction</span>
            <span className="font-mono text-teal-400 font-bold">
              ({simulatedInput.BMI.toFixed(1)} kg/m²)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="8"
              step="0.5"
              value={bmiReduction}
              onChange={(e) => setBmiReduction(Math.max(0, Math.min(8, Number(e.target.value))))}
              className="w-32 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            />
            <span className="text-xs text-slate-300 font-medium">kg/m² reduction</span>
          </div>
          <p className="text-xs text-slate-400">
            Each 1-unit drop in BMI relieves cardiac workload and decreases insulin resistance.
          </p>
        </div>

        {/* Lever 3: Exercise Frequency */}
        <div className="space-y-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-200">Increase Physical Activity</span>
            <span className="font-mono text-teal-400 font-bold">
              ({simulatedInput.Physical_Activity_Days} days/wk)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="7"
              step="1"
              value={extraExerciseDays}
              onChange={(e) => setExtraExerciseDays(Math.max(0, Math.min(7, Number(e.target.value))))}
              className="w-32 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none"
            />
            <span className="text-xs text-slate-300 font-medium">Extra days/wk</span>
          </div>
          <p className="text-xs text-slate-400">
            150 minutes weekly of brisk walking, swimming, or cardio strengthens heart reserve.
          </p>
        </div>

        {/* Lever 4: Toggle Habits */}
        <div className="flex flex-col justify-around gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={quitSmoking}
              disabled={originalInput.Smoking_Status !== "Current"}
              onChange={(e) => setQuitSmoking(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 accent-teal-400 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">
                Quit Smoking Completely
              </span>
              <span className="text-xs text-slate-400">
                {originalInput.Smoking_Status === "Current"
                  ? "Immediate 50% drop in secondary cardiac risk within 1 year"
                  : "Patient is already a non-smoker or former smoker"}
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={improveDiet}
              onChange={(e) => setImproveDiet(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 accent-teal-400 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">
                Adopt Mediterranean / DASH Diet
              </span>
              <span className="text-xs text-slate-400">
                Rich in fiber, omega-3 fatty acids, and antioxidants.
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
