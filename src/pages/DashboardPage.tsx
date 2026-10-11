import React, { useState, useEffect, useMemo } from "react";
import { PredictionResult, evaluateFamilyAlerts, DEFAULT_PATIENT } from "../services/riskModel.ts";
import { historyService } from "../services/historyService.ts";
import { generatePatientPDFReport } from "../components/PDFReportGenerator";
import {
  TrendingUp, Activity, Calendar, Download, RefreshCw, Search,
  Heart, ShieldAlert, BarChart3, ArrowUpRight, User, Trash2, CalendarCheck,
  ChevronLeft, ChevronRight, X, AlertTriangle, ShieldCheck, FileText, CheckCircle2,
  AlertCircle, Sparkles, Stethoscope, Dna, ArrowLeft, Users, Clock, ExternalLink
} from "lucide-react";
import { InteractiveCard } from "../components/InteractiveCard";

interface DashboardPageProps {
  currentResult?: PredictionResult | null;
  onSelectPrediction: (result: PredictionResult) => void;
  onNewAssessment: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentResult,
  onSelectPrediction,
  onNewAssessment
}) => {
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  // Load history from unified historyService and sync with backend
  const loadHistory = async () => {
    setIsLoading(true);
    try {
      // 1. Load from localStorage first (guaranteed instant records including default seed evaluations)
      const localRecords = historyService.getAssessments();

      // 2. Sync with server /api/history
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.history) && data.history.length > 0) {
            data.history.forEach((rec: any) => {
              const formatted: PredictionResult = {
                ...rec,
                patient_input: rec.patient_input || rec.input || {}
              };
              historyService.saveAssessment(formatted);
            });
          }
        }
      } catch (networkErr) {
        // Offline / network failure is safely ignored
      }

      // Re-read combined clean records from historyService
      const finalRecords = historyService.getAssessments();
      setHistory(finalRecords);
    } catch (e) {
      console.error("Error loading assessment history:", e);
      setHistory(historyService.getAssessments());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [currentResult]);

  // Combined assessments (most recent first)
  const combinedHistory = useMemo(() => {
    return history;
  }, [history]);

  // Selected assessment record for deep detail view
  const selectedRecord = useMemo(() => {
    if (!selectedAssessmentId) return null;
    return historyService.getAssessmentById(selectedAssessmentId) || combinedHistory.find(h => h.id === selectedAssessmentId) || null;
  }, [selectedAssessmentId, combinedHistory]);

  // Find index of selected record in combined list for previous/next navigation
  const selectedIndex = useMemo(() => {
    if (!selectedAssessmentId) return -1;
    return combinedHistory.findIndex(h => h.id === selectedAssessmentId);
  }, [selectedAssessmentId, combinedHistory]);

  const hasPrevRecord = selectedIndex > 0;
  const hasNextRecord = selectedIndex >= 0 && selectedIndex < combinedHistory.length - 1;

  const handlePrevRecord = () => {
    if (hasPrevRecord) {
      setSelectedAssessmentId(combinedHistory[selectedIndex - 1].id);
    }
  };

  const handleNextRecord = () => {
    if (hasNextRecord) {
      setSelectedAssessmentId(combinedHistory[selectedIndex + 1].id);
    }
  };

  // KPI Calculations
  const totalCount = combinedHistory.length;
  const avgScore = totalCount > 0
    ? (combinedHistory.reduce((acc, h) => acc + (h.risk_score_estimate || 0), 0) / totalCount).toFixed(1)
    : "0.0";
  const highRiskCount = combinedHistory.filter((h) => h.risk_level === "High").length;
  const highRiskRate = totalCount > 0 ? ((highRiskCount / totalCount) * 100).toFixed(1) : "0.0";

  // Filtered rows matching search query and risk level filter
  const filteredRows = useMemo(() => {
    return combinedHistory.filter((row) => {
      const p = row.patient_input || (row as any).input || {};
      const patientName = p.Patient_Name || (row as any).Patient_Name || "";
      const matchesFilter = filterLevel === "All" || row.risk_level === filterLevel;
      
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesFilter;

      const matchesSearch =
        patientName.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.risk_level.toLowerCase().includes(q) ||
        String(p.Age || "").includes(q) ||
        String(p.Location || "").toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [combinedHistory, filterLevel, searchQuery]);

  const handleDeleteRecord = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedAssessmentId === id) {
      setSelectedAssessmentId(null);
    }
    historyService.deleteAssessment(id);
    setHistory(historyService.getAssessments());
  };

  // Helper to format values safely with "Not provided" fallback
  const formatVal = (val: any, suffix = ""): string => {
    if (val === undefined || val === null || val === "" || val === "Not provided") {
      return "Not provided";
    }
    return `${val}${suffix}`;
  };

  // ==========================================
  // VIEW: FULL PATIENT ASSESSMENT DETAILS VIEW
  // ==========================================
  if (selectedRecord) {
    const p = selectedRecord.patient_input || (selectedRecord as any).input || {};
    const patientName = p.Patient_Name || (selectedRecord as any).Patient_Name || "Not provided";
    const patientAge = p.Age !== undefined && p.Age !== null ? `${p.Age} years` : "Not provided";
    const patientGender = p.Gender || "Not provided";
    const patientLocation = p.Location || "Not provided";

    const isHigh = selectedRecord.risk_level === "High";
    const isMod = selectedRecord.risk_level === "Moderate";
    const dateStr = new Date(selectedRecord.timestamp).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = new Date(selectedRecord.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Family history alerts
    const familyAlerts = selectedRecord.family_alerts || evaluateFamilyAlerts(p);

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Top Navigation & Action Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Back to Assessment History Button */}
          <button
            onClick={() => setSelectedAssessmentId(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Assessment History</span>
          </button>

          {/* Record Carousel Controls and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Record pager */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 mr-1">
              <button
                onClick={handlePrevRecord}
                disabled={!hasPrevRecord}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous assessment record"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-[11px] font-mono">
                {selectedIndex + 1} of {combinedHistory.length}
              </span>
              <button
                onClick={handleNextRecord}
                disabled={!hasNextRecord}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next assessment record"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Download PDF button */}
            <button
              onClick={() => generatePatientPDFReport(selectedRecord)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Open in full Results view */}
            <button
              onClick={() => onSelectPrediction(selectedRecord)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Full Results Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => handleDeleteRecord(e, selectedRecord.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
              title="Delete this assessment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Patient Hero Profile Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-2xl shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {patientName}
                  </h1>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-white/10 text-teal-200 border border-white/10">
                    ID: {selectedRecord.id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span>{patientAge}</span>
                  <span>•</span>
                  <span>{patientGender}</span>
                  <span>•</span>
                  <span>{patientLocation}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-teal-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Evaluated: {dateStr} at {timeStr}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Category and Score Index Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 self-start md:self-auto">
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Risk Category
                </span>
                <span
                  className={`text-lg font-extrabold inline-flex items-center gap-1.5 ${
                    isHigh
                      ? "text-rose-400"
                      : isMod
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isHigh ? "bg-rose-400 animate-pulse" : isMod ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                  />
                  <span>{selectedRecord.risk_level} Risk</span>
                </span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center px-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Score Index
                </span>
                <div className="text-2xl font-black text-white">
                  {selectedRecord.risk_score_estimate}
                  <span className="text-xs font-normal text-slate-400 ml-0.5">/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Early Warning Alerts & Family History Concordance (PROMINENT AT TOP OF DETAILS) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Early Warning Alerts &amp; Family History Genetic Concordance
                </h2>
                <p className="text-xs text-slate-500">
                  Cross-evaluation of current clinical biomarkers with reported hereditary family conditions.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {familyAlerts.length} Alert{familyAlerts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {familyAlerts.map((alert, idx) => {
              const isHighSev = alert.severity === "high";
              const isModSev = alert.severity === "moderate";
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isHighSev
                      ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-950 dark:text-rose-200"
                      : isModSev
                      ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-200"
                      : "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isHighSev
                          ? "bg-rose-600 text-white"
                          : isModSev
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {isHighSev ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isModSev ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-extrabold text-sm">
                          {alert.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isHighSev
                              ? "bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-100"
                              : isModSev
                              ? "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-100"
                              : "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100"
                          }`}
                        >
                          {alert.severity === "high" ? "High Priority Warning" : alert.severity === "moderate" ? "Moderate Alert" : "Normal / Baseline"}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {alert.message}
                      </p>
                      {alert.action && (
                        <p className="text-[11px] pt-1 opacity-90 font-semibold flex items-center gap-1.5">
                          <span>Recommended Action:</span>
                          <span className="underline">{alert.action}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            Note: This early alert analysis combines personal biomarkers and familial history for risk-stratification awareness and does not constitute a formal medical diagnosis.
          </p>
        </div>

        {/* Detailed Metrics Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION A & D: Demographics & Vital Signs Matrix */}
          <div className="space-y-6">
            {/* Section A: Patient Demographics */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Section A: Patient Demographics
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Patient Full Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm truncate block mt-0.5">
                    {patientName}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Assessment Record ID</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block mt-0.5 truncate">
                    {selectedRecord.id}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Age</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {patientAge}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Biological Gender</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {patientGender}
                  </span>
                </div>
                <div className="col-span-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Location / Geographic Region</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {patientLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Section D: Vital Signs & Laboratory Markers */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Section D: Vital Signs &amp; Laboratory Markers
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Blood Pressure */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Blood Pressure (SBP / DBP)</span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base font-mono">
                    {p.Systolic_BP && p.Diastolic_BP ? `${p.Systolic_BP}/${p.Diastolic_BP} mmHg` : "Not provided"}
                  </div>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">
                    {selectedRecord.bp_category?.label || "Clinical BP assessment"}
                  </span>
                </div>

                {/* Fasting Blood Glucose */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Fasting Blood Glucose</span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base font-mono">
                    {formatVal(p.Blood_Glucose, " mg/dL")}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {p.Blood_Glucose >= 126 ? "Elevated (>125)" : p.Blood_Glucose >= 100 ? "Impaired Fasting" : "Normal (<100)"}
                  </span>
                </div>

                {/* Body Mass Index */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Body Mass Index (BMI)</span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base font-mono">
                    {formatVal(p.BMI, " kg/m²")}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {selectedRecord.bmi_category?.label || "WHO weight category"}
                  </span>
                </div>

                {/* Resting Heart Rate */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Resting Heart Rate</span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base font-mono">
                    {formatVal(p.Heart_Rate, " bpm")}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {p.Heart_Rate >= 100 ? "Tachycardia (>100 bpm)" : p.Heart_Rate < 60 ? "Bradycardia (<60 bpm)" : "Normal Sinus Rhythm"}
                  </span>
                </div>

                {/* Total Cholesterol */}
                <div className="col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px]">Total Serum Cholesterol</span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base font-mono">
                    {formatVal(p.Cholesterol, " mg/dL")}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    {p.Cholesterol >= 240 ? "High Dyslipidemia (>=240)" : p.Cholesterol >= 200 ? "Borderline High (200-239)" : "Desirable Level (<200)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B & C: Medical History, Family History, Lifestyle */}
          <div className="space-y-6">
            {/* Section B: Medical and Family History */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Section B: Medical &amp; Family History
                </h3>
              </div>

              {/* Personal Existing Medical Conditions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Personal Existing Conditions
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Hypertension", active: p.Hypertension === 1 },
                    { label: "Diabetes", active: p.Diabetes === 1 },
                    { label: "Heart Disease", active: p.Heart_Disease === 1 },
                    { label: "Stroke History", active: p.Stroke_History === 1 },
                    { label: "High Cholesterol", active: p.High_Cholesterol === 1 },
                    { label: "Kidney Disease", active: p.Kidney_Disease === 1 },
                    { label: "Asthma", active: p.Asthma === 1 },
                    { label: "Sickle Cell", active: p.Sickle_Cell_Disease === 1 },
                    { label: "Thalassemia", active: p.Thalassemia === 1 },
                    { label: "Cancer History", active: p.History_Of_Cancer === 1 }
                  ].map((cond) => (
                    <div
                      key={cond.label}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                        cond.active
                          ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                          : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <span className="truncate">{cond.label}</span>
                      <span className="text-[10px] font-bold shrink-0 ml-1">
                        {cond.active ? "Yes" : "No"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Medical History with Relatives */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Reported Family Medical History
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      label: "Family Heart Disease",
                      has: p.Family_History_Heart_Disease === 1,
                      rel: p.Family_History_Heart_Disease_Relative
                    },
                    {
                      label: "Family Diabetes",
                      has: p.Family_History_Diabetes === 1,
                      rel: p.Family_History_Diabetes_Relative
                    },
                    {
                      label: "Family High Blood Pressure",
                      has: p.Family_History_High_BP === 1,
                      rel: p.Family_History_High_BP_Relative
                    },
                    {
                      label: "Family High Cholesterol",
                      has: p.Family_History_High_Cholesterol === 1,
                      rel: p.Family_History_High_Cholesterol_Relative
                    },
                    {
                      label: "Family Stroke",
                      has: p.Family_History_Stroke === 1,
                      rel: p.Family_History_Stroke_Relative
                    },
                    {
                      label: "Family Kidney Disease",
                      has: p.Family_History_Kidney_Disease === 1,
                      rel: p.Family_History_Kidney_Disease_Relative
                    }
                  ].map((fam) => (
                    <div
                      key={fam.label}
                      className={`p-2.5 rounded-xl text-xs border ${
                        fam.has
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                          : "bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <div className="font-semibold">{fam.label}</div>
                      <div className="text-[11px] mt-0.5">
                        {fam.has ? (
                          <span className="font-bold text-amber-700 dark:text-amber-300">
                            Reported {fam.rel ? `(${fam.rel})` : "(First-degree)"}
                          </span>
                        ) : (
                          <span className="text-slate-400">None reported</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {p.Other_Family_Conditions && String(p.Other_Family_Conditions).trim() && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mt-2">
                    <span className="font-bold text-slate-500 block text-[11px]">Other Recorded Family Conditions:</span>
                    <span>{p.Other_Family_Conditions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section C: Lifestyle Information */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Section C: Lifestyle Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Smoking Habits</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {formatVal(p.Smoking_Status)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Alcohol Consumption</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {formatVal(p.Alcohol_Use)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Diet Quality</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {formatVal(p.Diet_Quality)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Physical Activity</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {p.Physical_Activity_Days !== undefined ? `${p.Physical_Activity_Days} days/week` : "Not provided"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Sleep Duration</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {p.Sleep_Hours !== undefined ? `${p.Sleep_Hours} hrs/night` : "Not provided"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Self-Reported Stress</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {formatVal(p.Stress_Level)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Healthcare Access</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {formatVal(p.Healthcare_Access)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Health Insurance</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                    {formatVal(p.Health_Insurance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION E (Part 2) & SECTION F: AI Model Outputs & Recommendations */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Section E &amp; F: AI Risk Prediction Results &amp; Assessment Information
              </h3>
              <p className="text-xs text-slate-500">
                Calibrated Soft-Voting Ensemble model outputs, SHAP attributions, and evidence-based preventive recommendations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Probabilities */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Model Probabilities Breakdown
              </span>
              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                  <span>Low Risk Probability</span>
                  <span className="font-mono">{Math.round((selectedRecord.probabilities?.Low || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(selectedRecord.probabilities?.Low || 0) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 pt-1">
                  <span>Moderate Risk Probability</span>
                  <span className="font-mono">{Math.round((selectedRecord.probabilities?.Moderate || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(selectedRecord.probabilities?.Moderate || 0) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-rose-700 dark:text-rose-400 pt-1">
                  <span>High Risk Probability</span>
                  <span className="font-mono">{Math.round((selectedRecord.probabilities?.High || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(selectedRecord.probabilities?.High || 0) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Identified Risk Factors (SHAP) */}
            <div className="md:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Identified Key Risk Factors (SHAP Attributions)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(selectedRecord.top_factors || []).slice(0, 4).map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {factor.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Recorded: {factor.value}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold shrink-0 px-2 py-0.5 rounded-lg ${
                        factor.direction === "raises risk"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {factor.impact > 0 ? `+${factor.impact}%` : `${factor.impact}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Preventive Measures */}
          {selectedRecord.recommendations && selectedRecord.recommendations.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Personalized Preventive Measures
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedRecord.recommendations.slice(0, 4).map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {rec.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section F: Technical Assessment Information */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessment ID</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {selectedRecord.id}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Timestamp</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {dateStr}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluation Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed &amp; Calibrated</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Model Engine</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                Soft-Voting Ensemble v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation and Return Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => setSelectedAssessmentId(null)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Assessment History</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generatePatientPDFReport(selectedRecord)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Download Patient PDF Report</span>
            </button>
            <button
              onClick={onNewAssessment}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Perform New Assessment</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ASSESSMENT HISTORY TABLE & KPI VIEW
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Patient Assessment History
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Patient Assessment Records &amp; History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete database of past cardiometabolic risk assessments. Click any patient to view comprehensive evaluation details or re-download PDF reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadHistory()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onNewAssessment}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InteractiveCard enableTilt={true} className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Saved Assessments
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalCount}
            </div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
              Active patient evaluations
            </span>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Average Risk Score
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {avgScore}
              <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Overall cohort index
            </span>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              High Risk Cases
            </span>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {highRiskCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {highRiskRate}% of recorded assessments
            </span>
          </InteractiveCard>

          <InteractiveCard enableTilt={true} className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Latest Evaluation
            </span>
            <div className="text-base font-bold text-slate-900 dark:text-white truncate">
              {combinedHistory[0]?.patient_input?.Patient_Name || "Patient"}
            </div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              {new Date(combinedHistory[0]?.timestamp).toLocaleDateString()}
            </span>
          </InteractiveCard>
        </div>
      )}

      {/* History Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Saved Assessments Archive
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any past assessment to review complete findings or re-download the clinical PDF report.
            </p>
          </div>

          {/* Search Box & Risk Level Filter */}
          {totalCount > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient name, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-800 dark:text-slate-200 w-56 transition-all"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {["All", "Low", "Moderate", "High"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilterLevel(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      filterLevel === lvl
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State when no assessments have been saved */}
        {totalCount === 0 ? (
          <div className="py-16 text-center space-y-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 px-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800 shadow-xs">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                No Assessment History Found
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                You haven't completed any patient health assessments yet. Complete your first assessment to calculate cardiometabolic risk and save your results here.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onNewAssessment}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Start Health Risk Assessment</span>
              </button>
            </div>
          </div>
        ) : filteredRows.length === 0 ? (
          /* Search result empty state */
          <div className="py-12 text-center space-y-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-6 h-6 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching patient records found
            </p>
            <p className="text-xs text-slate-400">
              No assessments match "{searchQuery}" with the "{filterLevel}" filter.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setFilterLevel("All"); }}
              className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer pt-2"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          /* Assessment Table */
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Assessment Date &amp; Time</th>
                  <th className="py-3.5 px-4">Key Vitals</th>
                  <th className="py-3.5 px-4">Predicted Risk Level</th>
                  <th className="py-3.5 px-4 text-center">Score Index</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((row) => {
                  const p = row.patient_input || (row as any).input || {};
                  const isHigh = row.risk_level === "High";
                  const isMod = row.risk_level === "Moderate";
                  const patientName = p.Patient_Name || (row as any).Patient_Name || "Not provided";
                  const dateStr = new Date(row.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const timeStr = new Date(row.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedAssessmentId(row.id)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* Patient Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-sm group-hover:text-teal-600 transition-colors">
                              {patientName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {row.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Age & Gender */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{p.Age ? `${p.Age} yrs` : "N/A"}</span>
                        <span className="text-slate-400 ml-1.5">• {p.Gender || "N/A"}</span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">{dateStr}</span>
                        <span className="text-[11px] text-slate-400">{timeStr}</span>
                      </td>

                      {/* Key Vitals */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        <span>{p.Systolic_BP || "--"}/{p.Diastolic_BP || "--"} mmHg</span>
                        <span className="text-slate-400 block text-[10px] font-sans">
                          Glucose: {p.Blood_Glucose || "--"} mg/dL
                        </span>
                      </td>

                      {/* Predicted Risk Level */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 ${
                            isHigh
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                              : isMod
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isHigh ? "bg-rose-500" : isMod ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                          <span>{row.risk_level} Risk</span>
                        </span>
                      </td>

                      {/* Risk Score Index */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {row.risk_score_estimate}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ 100</span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedAssessmentId(row.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors cursor-pointer"
                            title="View Full Assessment Details"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => generatePatientPDFReport(row)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Download Clinical PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteRecord(e, row.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
