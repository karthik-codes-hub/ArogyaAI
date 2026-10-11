import React, { useEffect, useState } from "react";
import { Search, X, Activity, BarChart2, BookOpen, MessageSquare, ArrowRight, ShieldCheck, Heart } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onLoadPreset: (preset: "Low" | "Moderate" | "High") => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLoadPreset
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // handled by parent
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: "landing", label: "Overview - Home & Health Monitor", icon: Heart, page: "landing", category: "Navigation" },
    { id: "assess", label: "Start Health Risk Assessment", icon: Activity, page: "assessment", category: "Actions" },
    { id: "dashboard", label: "View Assessment History & Records", icon: BarChart2, page: "dashboard", category: "Navigation" },
    { id: "resources", label: "Patient Resources & Health Education", icon: BookOpen, page: "resources", category: "Education" },
    { id: "safety", label: "Clinical Safety & Guardrails Guidelines", icon: ShieldCheck, page: "safety", category: "Clinical Safety" },
    { id: "feedback", label: "Patient Feedback & Support", icon: MessageSquare, page: "feedback", category: "Support" }
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to page... (e.g. Assessment, History, Safety)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.page) onNavigate(item.page);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-50 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-[#009B77] transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#009B77] transition-colors opacity-0 group-hover:opacity-100" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
          <span>Click to jump directly to section</span>
          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
