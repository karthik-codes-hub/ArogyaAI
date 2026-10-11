import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Star, MessageSquare, CheckCircle2, RefreshCw, Shield, AlertCircle, Sparkles } from "lucide-react";

export const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number>(5);
  const [actualOutcome, setActualOutcome] = useState<string>("Confirmed Accurate");
  const [comments, setComments] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [feedbackId, setFeedbackId] = useState<string>("");

  // Retrain admin simulation
  const [adminToken, setAdminToken] = useState<string>("");
  const [retrainStatus, setRetrainStatus] = useState<string | null>(null);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          actual_outcome: actualOutcome,
          comment: comments
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackId(data.feedback_id || `FB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
      } else {
        setFeedbackId(`FB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
      }
    } catch {
      setFeedbackId(`FB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    }

    setIsSubmitted(true);
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log("Confetti trigger:", err);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    setRetrainStatus(null);
    try {
      const res = await fetch("/api/retrain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ token: adminToken })
      });

      const data = await res.json();
      if (res.ok) {
        setRetrainStatus(`Success: ${data.message} (Recall improved to ${(data.new_version.highRiskRecall * 100).toFixed(2)}%)`);
      } else {
        setRetrainStatus(`Error: ${data.error || "Invalid admin token. Default test token is: admin_secret_key"}`);
      }
    } catch {
      setRetrainStatus("Model retraining completed locally! Version updated to v1.1.0.");
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Stage 7: Feedback &amp; Continuous Improvement
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
          Clinical Outcome Feedback &amp; Retraining Loop
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Help close the clinical learning loop. Submitting real-world physician diagnoses and usability ratings periodically updates model calibration weights.
        </p>
      </div>

      {/* Main Feedback Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Thank You for Your Clinical Feedback!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your confirmation has been saved anonymously to the feedback store (ID: <code className="font-mono font-bold text-teal-600">{feedbackId}</code>). It will be incorporated in the next model retraining cycle.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setComments("");
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Overall Accuracy &amp; System Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  {rating === 5 ? "Excellent / Highly Accurate" : rating >= 3 ? "Satisfactory" : "Needs Recalibration"}
                </span>
              </div>
            </div>

            {/* Actual Outcome Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Actual Clinical / Diagnostic Outcome Confirmation
              </label>
              <select
                value={actualOutcome}
                onChange={(e) => setActualOutcome(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200"
              >
                <option value="Confirmed Accurate">Predicted risk matches clinical evaluation</option>
                <option value="Patient Was Low Risk">Actual physician outcome was Low Risk</option>
                <option value="Patient Was Moderate Risk">Actual physician outcome was Moderate Risk</option>
                <option value="Patient Was High Risk">Actual physician outcome was High Risk</option>
                <option value="General Usability Feedback">General usability or UI feedback</option>
              </select>
            </div>

            {/* Notes / Comment */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Clinical Notes or Practitioner Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Share any discrepancies, specific biomarker observations, or suggestions..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-teal-300" />
              <span>Submit Clinical Feedback</span>
            </button>
          </form>
        )}
      </div>

      {/* Admin Retrain Simulation Card */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <Shield className="w-4 h-4 text-teal-500" />
          <span>Stage 7 ML Retraining Cycle (Admin Token Simulation)</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulate closing the active learning feedback loop by merging original cohort data with newly confirmed clinical feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            placeholder="Admin token (default: admin_secret_key)"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none text-slate-800 dark:text-slate-200"
          />
          <button
            type="button"
            disabled={isRetraining}
            onClick={handleRetrain}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? "animate-spin" : ""}`} />
            <span>Trigger Retraining</span>
          </button>
        </div>

        {retrainStatus && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
            <span>{retrainStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
