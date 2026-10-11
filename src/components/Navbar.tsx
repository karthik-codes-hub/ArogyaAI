import React, { useState } from "react";
import {
  Activity, MessageSquare, Search, HeartPulse, CalendarCheck,
  FileText, ShieldAlert, Menu, X, ArrowRight
} from "lucide-react";
import { ArogyaLogo } from "./ArogyaLogo";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenCommandPalette
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core navigation items with clear, single-line labels
  const navItems = [
    { id: "landing", label: "Overview", icon: HeartPulse },
    { id: "assessment", label: "Risk Assessment", icon: Activity },
    { id: "dashboard", label: "Assessment History", icon: CalendarCheck },
    { id: "resources", label: "Patient Resources", icon: FileText },
    { id: "safety", label: "Clinical Safety", icon: ShieldAlert },
    { id: "feedback", label: "Feedback & Support", icon: MessageSquare }
  ];

  const handleMobileNavigate = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[74px] flex items-center justify-between gap-3">
        {/* Left: Brand Logo (approx 140-160px width) */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center text-left group cursor-pointer hover:opacity-95 transition-opacity shrink-0 py-1"
          aria-label="ArogyaAI Home"
        >
          <ArogyaLogo size="md" variant="horizontal" />
        </button>

        {/* Center: Desktop Navigation Bar in Single Grouped Pill Container */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/70 dark:border-slate-700/60 shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400 dark:text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Quick Actions, Check Risk Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Actions / Command Palette (Cmd+K) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Search quick actions (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Quick Actions</span>
            <kbd className="font-mono text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-xs text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Primary CTA button: Check My Risk */}
          {currentPage !== "assessment" && (
            <button
              onClick={() => onNavigate("assessment")}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <Activity className="w-4 h-4 text-teal-200" />
              <span className="hidden sm:inline">Check My Risk</span>
              <span className="sm:hidden">Check Risk</span>
            </button>
          )}

          {/* Mobile & Tablet Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Slide-Down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavigate(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-teal-500" />}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Search button in mobile drawer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search Quick Actions (Cmd+K)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
