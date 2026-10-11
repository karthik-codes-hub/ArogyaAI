import React from "react";
import { AlertTriangle } from "lucide-react";
import { ArogyaLogo } from "./ArogyaLogo";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/90 bg-white transition-colors">
      {/* Medical Disclaimer Ribbon */}
      <div className="bg-amber-50/90 border-b border-amber-200/70 px-4 py-3">
        <div className="max-w-[1360px] mx-auto flex items-start sm:items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            <strong className="font-bold">Medical Disclaimer:</strong> AI health risk predictions are estimates for informational purposes and do not replace professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          {/* Brand & Compact Tagline/Description */}
          <div className="space-y-2">
            <ArogyaLogo size="sm" showTagline={true} variant="horizontal" />
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed">
              AI-powered health risk assessment to support informed healthcare decisions.
            </p>
          </div>

          {/* Quick Nav / Tagline */}
          <div className="text-xs sm:text-sm font-semibold text-[#1769AA]">
            Predict Early. Prevent Better. Live Healthier.
          </div>
        </div>

        {/* Footer Bottom Bar with Copyright */}
        <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>
            © 2026 ArogyaAI. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 transition-colors cursor-pointer">
              Privacy &amp; Terms
            </span>
            <span className="hover:text-slate-700 transition-colors cursor-pointer">
              Clinical Validation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

