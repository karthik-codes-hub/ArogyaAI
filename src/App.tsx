import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { CommandPalette } from "./components/CommandPalette";
import { LandingPage } from "./pages/LandingPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { ResultsPage } from "./pages/ResultsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PatientResourcesPage } from "./pages/PatientResourcesPage";
import { ClinicalSafetyPage } from "./pages/ClinicalSafetyPage";
import { ModelInsightsPage } from "./pages/ModelInsightsPage";
import { WorkflowPage } from "./pages/WorkflowPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { PatientInput, PredictionResult, SAMPLE_PROFILES, predictRisk, DEFAULT_PATIENT } from "./services/riskModel.ts";
import { historyService } from "./services/historyService.ts";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<PatientInput | undefined>(undefined);
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);

  // Ensure dark mode is cleared and light mode is enforced
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("arogya_theme");
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Preload sample assessment for preview
  useEffect(() => {
    const initialSample = predictRisk(SAMPLE_PROFILES.Moderate);
    setCurrentResult(initialSample);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadPreset = (preset: "Low" | "Moderate" | "High") => {
    setCurrentInput(SAMPLE_PROFILES[preset]);
    handleNavigate("assessment");
  };

  const handlePredictionComplete = (result: PredictionResult) => {
    // Explicitly persist completed assessment into history service
    historyService.saveAssessment(result);
    setCurrentResult(result);
    setCurrentInput(result.patient_input);
    handleNavigate("results");
  };

  return (
    <div className="min-h-screen flex bg-[#F5F8FC] text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Modern Fixed Vertical Left Sidebar (250px on desktop, collapsible on mobile) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onToggleMobile={() => setIsMobileNavOpen((prev) => !prev)}
      />

      {/* Main Content Area Positioned to the Right of the Sidebar (lg:pl-[250px]) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[250px] pt-[68px] sm:pt-[72px] lg:pt-0">
        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {currentPage === "landing" && (
            <LandingPage
              onStartAssessment={() => handleNavigate("assessment")}
              onViewHistory={() => handleNavigate("dashboard")}
            />
          )}

        {currentPage === "assessment" && (
          <AssessmentPage
            initialInput={currentInput}
            onPredictionComplete={handlePredictionComplete}
          />
        )}

        {currentPage === "results" && (
          <ResultsPage
            result={currentResult || predictRisk(currentInput || DEFAULT_PATIENT)}
            onModifyAssessment={() => handleNavigate("assessment")}
          />
        )}

        {currentPage === "dashboard" && (
          <DashboardPage
            currentResult={currentResult}
            onSelectPrediction={(res) => {
              const fullRes = res.probabilities && res.top_factors ? res : predictRisk(res.patient_input || DEFAULT_PATIENT);
              setCurrentResult(fullRes);
              setCurrentInput(fullRes.patient_input);
              handleNavigate("results");
            }}
            onNewAssessment={() => handleNavigate("assessment")}
          />
        )}

        {currentPage === "resources" && (
          <PatientResourcesPage onStartAssessment={() => handleNavigate("assessment")} />
        )}

        {currentPage === "safety" && (
          <ClinicalSafetyPage onStartAssessment={() => handleNavigate("assessment")} />
        )}

        {currentPage === "models" && <ModelInsightsPage />}

        {currentPage === "workflow" && <WorkflowPage />}

        {currentPage === "feedback" && <FeedbackPage />}
        </main>

        {/* Persistent Medical Disclaimer & Navigation Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Quick Actions Search Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onLoadPreset={handleLoadPreset}
      />
    </div>
  );
}
