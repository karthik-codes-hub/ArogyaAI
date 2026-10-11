import React from "react";
import { ShapFactor } from "../services/riskModel.ts";
import { TrendingUp, TrendingDown, HelpCircle, Activity } from "lucide-react";

interface ShapWaterfallProps {
  factors: ShapFactor[];
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({ factors }) => {
  // Find max impact to normalize bar lengths
  const maxImpact = Math.max(15, ...factors.map((f) => Math.abs(f.impact)));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Key Health Risk Influences</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Personal Risk Drivers
            </span>
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Key vital signs and daily habits that either protect your wellness or contribute towards higher health risk.
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {factors.map((factor, idx) => {
          const isRiskRaising = factor.direction === "raises risk";
          const barWidthPercent = Math.min(100, Math.max(8, (Math.abs(factor.impact) / maxImpact) * 100));

          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 transition-all hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isRiskRaising
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {isRiskRaising ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {factor.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    {factor.value}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isRiskRaising
                        ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    {isRiskRaising ? "Contributing Risk Factor" : "Protective Healthy Factor"}
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden flex">
                {isRiskRaising ? (
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-700"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                ) : (
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-1">
                <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                <span>{factor.clinicalContext}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
