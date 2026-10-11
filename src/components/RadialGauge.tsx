import React from "react";

interface RadialGaugeProps {
  score: number; // 0 to 100
  riskLevel: "Low" | "Moderate" | "High";
  probabilities: { Low: number; Moderate: number; High: number };
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({ score, riskLevel, probabilities }) => {
  // Arc parameters (semicircular gauge: 180 degrees)
  const radius = 88;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Color selection based on risk level
  const colors = {
    Low: {
      primary: "#10B981", // emerald-500
      glow: "rgba(16, 185, 129, 0.25)",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800"
    },
    Moderate: {
      primary: "#F59E0B", // amber-500
      glow: "rgba(245, 158, 11, 0.25)",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800"
    },
    High: {
      primary: "#EF4444", // red-500
      glow: "rgba(239, 68, 68, 0.25)",
      bg: "bg-red-50 dark:bg-red-950/40",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800"
    }
  }[riskLevel];

  // Needle angle: -90 deg (score 0) to +90 deg (score 100)
  const needleRotation = -90 + (clampedScore / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="relative w-64 h-36 flex items-center justify-center overflow-visible">
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full transform overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeBgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="gaugeActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 12 105 A 88 88 0 0 1 188 105"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Active Value Arc */}
          <path
            d="M 12 105 A 88 88 0 0 1 188 105"
            fill="none"
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease",
              filter: `drop-shadow(0 0 6px ${colors.glow})`
            }}
          />

          {/* Threshold zone markers */}
          {/* Low / Mod marker at 35% */}
          <circle cx="58" cy="38" r="1.5" className="fill-slate-300 dark:fill-slate-600" />
          {/* Mod / High marker at 65% */}
          <circle cx="142" cy="38" r="1.5" className="fill-slate-300 dark:fill-slate-600" />

          {/* Needle Center Pivot */}
          <g transform="translate(100, 105)">
            <g transform={`rotate(${needleRotation})`} style={{ transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <polygon points="0,-78 -3,0 3,0" fill={colors.primary} opacity="0.9" />
              <circle cx="0" cy="0" r="6" fill="#0B3A6F" className="dark:fill-slate-200" />
              <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
            </g>
          </g>
        </svg>

        {/* Numeric Gauge Overlay */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {clampedScore.toFixed(1)}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Risk Index / 100
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-bold border ${colors.bg} ${colors.text} ${colors.border} flex items-center gap-2 shadow-xs`}>
        <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }}></span>
        <span>{riskLevel} Risk Classification</span>
      </div>

      {/* Probability Breakdown Bars */}
      <div className="w-full mt-6 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex justify-between">
          <span>Risk Category Distribution</span>
          <span>Estimated Likelihood</span>
        </div>

        {/* Low Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Low Risk (&lt; 35)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{(probabilities.Low * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${probabilities.Low * 100}%` }}
            />
          </div>
        </div>

        {/* Moderate Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-amber-700 dark:text-amber-400 font-medium">Moderate (35 - 64.9)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{(probabilities.Moderate * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-700"
              style={{ width: `${probabilities.Moderate * 100}%` }}
            />
          </div>
        </div>

        {/* High Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-700 dark:text-red-400 font-medium">High Risk (≥ 65)</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{(probabilities.High * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-700"
              style={{ width: `${probabilities.High * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
