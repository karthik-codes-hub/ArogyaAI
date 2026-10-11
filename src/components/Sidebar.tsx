import React, { useState } from "react";
import {
  HeartPulse, Activity, CalendarCheck, FileText, ShieldAlert,
  MessageSquare, Search, Sparkles, ChevronRight, X, Menu,
  Info, ShieldCheck, Heart
} from "lucide-react";
import { ArogyaLogo } from "./ArogyaLogo";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenCommandPalette: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenCommandPalette,
  isMobileOpen,
  onCloseMobile,
  onToggleMobile
}) => {
  // Navigation items as specified in requirements:
  // 1. Overview
  // 2. Risk Assessment
  // 3. Assessment History
  // 4. Patient Resources
  // 5. Clinical Safety
  // 6. Feedback & Support
  // + Quick Actions
  const navItems = [
    {
      id: "landing",
      label: "Overview",
      icon: HeartPulse,
      badge: null,
      description: "Home & health monitor"
    },
    {
      id: "assessment",
      label: "Risk Assessment",
      icon: Activity,
      badge: "AI",
      description: "Multivariate prediction"
    },
    {
      id: "dashboard",
      label: "Assessment History",
      icon: CalendarCheck,
      badge: null,
      description: "Patient records & trends"
    },
    {
      id: "resources",
      label: "Patient Resources",
      icon: FileText,
      badge: null,
      description: "Health guides & metrics"
    },
    {
      id: "safety",
      label: "Clinical Safety",
      icon: ShieldAlert,
      badge: "Guardrails",
      description: "Protocols & triage"
    },
    {
      id: "feedback",
      label: "Feedback & Support",
      icon: MessageSquare,
      badge: null,
      description: "Patient experience"
    }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const handleQuickActionsClick = () => {
    onOpenCommandPalette();
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FFFFFF] text-slate-800 border-r border-slate-200/90 shadow-sm select-none">
      {/* Top Header / Branding Area: Complete ArogyaAI Logo with safe vertical padding */}
      <div className="min-h-[88px] py-3.5 px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
        <button
          onClick={() => handleItemClick("landing")}
          className="flex-1 flex items-center justify-center text-center group cursor-pointer hover:opacity-95 transition-opacity py-1 overflow-visible"
          aria-label="ArogyaAI Home"
        >
          <ArogyaLogo size="md" variant="horizontal" className="transition-transform group-hover:scale-[1.01]" />
        </button>

        {/* Close button visible only on mobile drawer */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          aria-label="Close navigation sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Clinical Status Micro-Badge */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#009B77]"></span>
            </span>
            <span className="font-semibold text-slate-700">Clinical AI Engine</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#009B77] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
            v2.4
          </span>
        </div>
      </div>

      {/* Main Navigation Items Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 scrollbar-thin">
        <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? "bg-gradient-to-r from-teal-50/90 via-emerald-50/60 to-white text-[#009B77] font-bold border border-emerald-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/90 border border-transparent"
              }`}
            >
              {/* Active Indicator Bar on left edge */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#009B77] rounded-r-full shadow-xs"
                  aria-hidden="true"
                />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#009B77] text-white shadow-xs"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <span className={`block truncate ${isActive ? "text-[#009B77] font-bold" : "text-slate-700"}`}>
                    {item.label}
                  </span>
                </div>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    isActive
                      ? "bg-[#009B77] text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              ) : isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#009B77] shrink-0" />
              ) : null}
            </button>
          );
        })}

        {/* Quick Actions Item within primary navigation list */}
        <div className="pt-2">
          <button
            onClick={handleQuickActionsClick}
            className="w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50/90 border border-transparent transition-all cursor-pointer"
            title="Search quick actions (Cmd+K / Ctrl+K)"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1769AA] group-hover:bg-blue-100/80 flex items-center justify-center shrink-0 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-slate-700 font-medium">Quick Actions</span>
            </div>
            <kbd className="font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Primary Call-to-Action Card at Bottom of Sidebar */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 shrink-0 space-y-3">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#102044] to-[#1769AA] text-white shadow-md space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-white/15">
              <Activity className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">
              Instant Risk Triage
            </span>
          </div>
          <p className="text-[11px] text-slate-200 leading-snug">
            Run an AI health evaluation across 20+ clinical risk factors.
          </p>
          <button
            onClick={() => handleItemClick("assessment")}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#009B77] hover:bg-[#008766] text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Check My Risk</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-200" />
          </button>
        </div>

        {/* Micro-Disclaimer Note */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">HIPAA-aligned &amp; clinical safeguards</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Vertical Left Sidebar (~250px width) */}
      <aside
        className="hidden lg:block fixed top-0 left-0 bottom-0 w-[250px] z-30 transition-all"
        aria-label="Desktop primary navigation"
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile & Tablet Top Bar (Fixed) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 min-h-[68px] sm:min-h-[72px] bg-white/95 backdrop-blur-md border-b border-slate-200/90 z-20 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-xs">
        <button
          onClick={() => handleItemClick("landing")}
          className="flex items-center text-left cursor-pointer shrink-0 min-w-0 py-1"
          aria-label="ArogyaAI Home"
        >
          <ArogyaLogo size="md" variant="horizontal" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Actions Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs transition-colors cursor-pointer"
            title="Quick Actions"
            aria-label="Open Quick Actions Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick CTA button (hidden on very narrow screens <380px to prevent overlap) */}
          {currentPage !== "assessment" && (
            <button
              onClick={() => handleItemClick("assessment")}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#009B77] hover:bg-[#008766] text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Check Risk</span>
            </button>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={onToggleMobile}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 3. Mobile & Tablet Collapsible Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Sliding Left Drawer (260px) */}
          <aside
            className="fixed top-0 bottom-0 left-0 w-[270px] max-w-[85vw] bg-white z-50 shadow-2xl transition-transform duration-300 transform translate-x-0"
            aria-label="Mobile primary navigation"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
