import React, { useState, useEffect } from "react";
import { PatientInput, DEFAULT_PATIENT, PredictionResult } from "../services/riskModel.ts";
import {
  User, Heart, Activity, ShieldAlert, CheckCircle, ChevronLeft, ChevronRight,
  RotateCcw, Sparkles, Scale, AlertCircle, ArrowRight, MapPin, Users
} from "lucide-react";

interface AssessmentPageProps {
  initialInput?: PatientInput;
  onPredictionComplete: (result: PredictionResult) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  initialInput,
  onPredictionComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<PatientInput>(initialInput || DEFAULT_PATIENT);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Age direct keyboard entry state and validation
  const [ageInputText, setAgeInputText] = useState<string>(String(form.Age || 45));
  const [ageError, setAgeError] = useState<string | null>(null);

  // Vitals & Biomarkers direct keyboard entry states and validations
  const [bmiInputText, setBmiInputText] = useState<string>(String(form.BMI !== undefined ? form.BMI : 24.5));
  const [bmiError, setBmiError] = useState<string | null>(null);

  const [sbpInputText, setSbpInputText] = useState<string>(String(form.Systolic_BP || 120));
  const [sbpError, setSbpError] = useState<string | null>(null);

  const [dbpInputText, setDbpInputText] = useState<string>(String(form.Diastolic_BP || 80));
  const [dbpError, setDbpError] = useState<string | null>(null);

  const [glucoseInputText, setGlucoseInputText] = useState<string>(String(form.Blood_Glucose || 95));
  const [glucoseError, setGlucoseError] = useState<string | null>(null);

  const [cholInputText, setCholInputText] = useState<string>(String(form.Cholesterol || 185));
  const [cholError, setCholError] = useState<string | null>(null);

  const [hrInputText, setHrInputText] = useState<string>(String(form.Heart_Rate || 72));
  const [hrError, setHrError] = useState<string | null>(null);

  // BMI Calculator Helper (Height in cm and Weight in kg)
  const [useHeightWeight, setUseHeightWeight] = useState<boolean>(false);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(75);

  useEffect(() => {
    if (initialInput) {
      setForm(initialInput);
      if (initialInput.Age !== undefined) setAgeInputText(String(initialInput.Age));
      if (initialInput.BMI !== undefined) setBmiInputText(String(initialInput.BMI));
      if (initialInput.Systolic_BP !== undefined) setSbpInputText(String(initialInput.Systolic_BP));
      if (initialInput.Diastolic_BP !== undefined) setDbpInputText(String(initialInput.Diastolic_BP));
      if (initialInput.Blood_Glucose !== undefined) setGlucoseInputText(String(initialInput.Blood_Glucose));
      if (initialInput.Cholesterol !== undefined) setCholInputText(String(initialInput.Cholesterol));
      if (initialInput.Heart_Rate !== undefined) setHrInputText(String(initialInput.Heart_Rate));
    }
  }, [initialInput]);

  useEffect(() => {
    if (useHeightWeight && heightCm > 50 && weightKg > 20) {
      const calculatedBmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
      setForm((prev: PatientInput) => ({ ...prev, BMI: calculatedBmi }));
      setBmiInputText(String(calculatedBmi));
      setBmiError(null);
    }
  }, [useHeightWeight, heightCm, weightKg]);

  const updateField = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
    setForm((prev: PatientInput) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setForm(DEFAULT_PATIENT);
    setAgeInputText(String(DEFAULT_PATIENT.Age));
    setAgeError(null);
    setBmiInputText(String(DEFAULT_PATIENT.BMI));
    setBmiError(null);
    setSbpInputText(String(DEFAULT_PATIENT.Systolic_BP));
    setSbpError(null);
    setDbpInputText(String(DEFAULT_PATIENT.Diastolic_BP));
    setDbpError(null);
    setGlucoseInputText(String(DEFAULT_PATIENT.Blood_Glucose));
    setGlucoseError(null);
    setCholInputText(String(DEFAULT_PATIENT.Cholesterol));
    setCholError(null);
    setHrInputText(String(DEFAULT_PATIENT.Heart_Rate));
    setHrError(null);
    setCurrentStep(1);
  };

  // Keyboard entry handlers for Age
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setAgeInputText(clean);

    if (clean === "") {
      setAgeError("Please enter your age.");
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      setAgeError("Please enter a valid numeric age.");
      return;
    }
    if (num < 18) {
      setAgeError("Age must be at least 18 years for adult health assessment.");
      updateField("Age", num);
    } else if (num > 105) {
      setAgeError("Maximum supported age is 105 years.");
      updateField("Age", 105);
    } else {
      setAgeError(null);
      updateField("Age", num);
    }
  };

  const handleAgeBlur = () => {
    if (!ageInputText || isNaN(parseInt(ageInputText, 10))) {
      setAgeInputText("45");
      updateField("Age", 45);
      setAgeError(null);
    } else {
      const num = parseInt(ageInputText, 10);
      const clamped = Math.max(18, Math.min(105, num));
      setAgeInputText(String(clamped));
      updateField("Age", clamped);
      setAgeError(null);
    }
  };

  // Keyboard entry handlers for BMI (allows decimals e.g. 24.5)
  const handleBmiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^[0-9]*\.?[0-9]*$/.test(raw)) return;
    setBmiInputText(raw);

    if (raw === "" || raw === ".") {
      setBmiError("Please enter your Body Mass Index (BMI).");
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num)) {
      setBmiError("Please enter a valid numeric value.");
      return;
    }
    if (num < 12.0) {
      setBmiError("BMI value is below clinical range (< 12.0 kg/m²).");
    } else if (num > 60.0) {
      setBmiError("BMI value exceeds clinical range (> 60.0 kg/m²).");
    } else {
      setBmiError(null);
    }
    updateField("BMI", num);
  };

  const handleBmiBlur = () => {
    const num = parseFloat(bmiInputText);
    if (isNaN(num) || num < 12.0) {
      const clamped = 18.5;
      setBmiInputText(String(clamped));
      updateField("BMI", clamped);
      setBmiError(null);
    } else if (num > 60.0) {
      const clamped = 60.0;
      setBmiInputText(String(clamped));
      updateField("BMI", clamped);
      setBmiError(null);
    } else {
      const formatted = Number(num.toFixed(1));
      setBmiInputText(String(formatted));
      updateField("BMI", formatted);
      setBmiError(null);
    }
  };

  // Keyboard entry handlers for Systolic BP (mmHg)
  const handleSbpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setSbpInputText(clean);

    if (clean === "") {
      setSbpError("Please enter systolic blood pressure.");
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      setSbpError("Please enter a valid number.");
      return;
    }
    if (num < 70) {
      setSbpError("Systolic BP is below usual range (< 70 mmHg).");
    } else if (num > 240) {
      setSbpError("Systolic BP exceeds supported range (> 240 mmHg).");
    } else {
      setSbpError(null);
    }
    updateField("Systolic_BP", num);
  };

  const handleSbpBlur = () => {
    const num = parseInt(sbpInputText, 10);
    if (isNaN(num) || num < 70) {
      const val = Math.max(70, isNaN(num) ? 120 : num);
      setSbpInputText(String(val));
      updateField("Systolic_BP", val);
      setSbpError(null);
    } else if (num > 240) {
      setSbpInputText("240");
      updateField("Systolic_BP", 240);
      setSbpError(null);
    }
  };

  // Keyboard entry handlers for Diastolic BP (mmHg)
  const handleDbpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setDbpInputText(clean);

    if (clean === "") {
      setDbpError("Please enter diastolic blood pressure.");
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      setDbpError("Please enter a valid number.");
      return;
    }
    if (num < 40) {
      setDbpError("Diastolic BP is below usual range (< 40 mmHg).");
    } else if (num > 150) {
      setDbpError("Diastolic BP exceeds supported range (> 150 mmHg).");
    } else {
      setDbpError(null);
    }
    updateField("Diastolic_BP", num);
  };

  const handleDbpBlur = () => {
    const num = parseInt(dbpInputText, 10);
    if (isNaN(num) || num < 40) {
      const val = Math.max(40, isNaN(num) ? 80 : num);
      setDbpInputText(String(val));
      updateField("Diastolic_BP", val);
      setDbpError(null);
    } else if (num > 150) {
      setDbpInputText("150");
      updateField("Diastolic_BP", 150);
      setDbpError(null);
    }
  };

  // Keyboard entry handlers for Blood Glucose (mg/dL)
  const handleGlucoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setGlucoseInputText(clean);

    if (clean === "") {
      setGlucoseError("Please enter fasting blood glucose.");
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      setGlucoseError("Please enter a valid number.");
      return;
    }
    if (num < 50) {
      setGlucoseError("Glucose is below standard clinical range (< 50 mg/dL).");
    } else if (num > 400) {
      setGlucoseError("Glucose exceeds standard range (> 400 mg/dL).");
    } else {
      setGlucoseError(null);
    }
    updateField("Blood_Glucose", num);
  };

  const handleGlucoseBlur = () => {
    const num = parseInt(glucoseInputText, 10);
    if (isNaN(num) || num < 50) {
      const val = Math.max(50, isNaN(num) ? 95 : num);
      setGlucoseInputText(String(val));
      updateField("Blood_Glucose", val);
      setGlucoseError(null);
    } else if (num > 400) {
      setGlucoseInputText("400");
      updateField("Blood_Glucose", 400);
      setGlucoseError(null);
    }
  };

  // Keyboard entry handlers for Total Cholesterol (mg/dL)
  const handleCholChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setCholInputText(clean);

    if (clean === "") {
      setCholError("Please enter total serum cholesterol.");
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      setCholError("Please enter a valid number.");
      return;
    }
    if (num < 80) {
      setCholError("Cholesterol is below typical range (< 80 mg/dL).");
    } else if (num > 500) {
      setCholError("Cholesterol exceeds typical range (> 500 mg/dL).");
    } else {
      setCholError(null);
    }
    updateField("Cholesterol", num);
  };

  const handleCholBlur = () => {
    const num = parseInt(cholInputText, 10);
    if (isNaN(num) || num < 80) {
      const val = Math.max(80, isNaN(num) ? 185 : num);
      setCholInputText(String(val));
      updateField("Cholesterol", val);
      setCholError(null);
    } else if (num > 500) {
      setCholInputText("500");
      updateField("Cholesterol", 500);
      setCholError(null);
    }
  };

  // Keyboard entry handlers for Resting Heart Rate (BPM)
  const handleHrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^0-9]/g, "");
    setHrInputText(clean);

    if (clean === "") {
      setHrError("Please enter resting heart rate.");
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      setHrError("Please enter a valid number.");
      return;
    }
    if (num < 40) {
      setHrError("Heart rate is below standard adult range (< 40 bpm).");
    } else if (num > 180) {
      setHrError("Heart rate exceeds standard adult range (> 180 bpm).");
    } else {
      setHrError(null);
    }
    updateField("Heart_Rate", num);
  };

  const handleHrBlur = () => {
    const num = parseInt(hrInputText, 10);
    if (isNaN(num) || num < 40) {
      const val = Math.max(40, isNaN(num) ? 72 : num);
      setHrInputText(String(val));
      updateField("Heart_Rate", val);
      setHrError(null);
    } else if (num > 180) {
      setHrInputText("180");
      updateField("Heart_Rate", 180);
      setHrError(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call backend API /api/predict
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Server prediction error");
      }

      const result: PredictionResult = await response.json();
      const finalResult: PredictionResult = {
        ...result,
        patient_input: {
          ...result.patient_input,
          ...form,
          Patient_Name: form.Patient_Name && form.Patient_Name.trim() ? form.Patient_Name.trim() : (result.patient_input?.Patient_Name || "Not provided"),
          Location: form.Location && form.Location.trim() ? form.Location.trim() : (result.patient_input?.Location || "Not provided"),
          Age: form.Age,
          Gender: form.Gender
        }
      };
      onPredictionComplete(finalResult);
    } catch (err) {
      console.warn("Falling back to client-side ML engine:", err);
      // Fallback directly to client-side engine if API fetch is interrupted
      const { predictRisk } = await import("../services/riskModel.ts");
      const clientResult = predictRisk(form);
      const finalClientResult: PredictionResult = {
        ...clientResult,
        patient_input: {
          ...clientResult.patient_input,
          ...form,
          Patient_Name: form.Patient_Name && form.Patient_Name.trim() ? form.Patient_Name.trim() : "Not provided",
          Location: form.Location && form.Location.trim() ? form.Location.trim() : "Not provided",
          Age: form.Age,
          Gender: form.Gender
        }
      };
      onPredictionComplete(finalClientResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRelKey = (key: string) => {
    if (key === "Family_History_Heart_Disease") return "Family_History_Heart_Disease_Relative";
    if (key === "Family_History_Diabetes") return "Family_History_Diabetes_Relative";
    if (key === "Family_History_High_BP") return "Family_History_High_BP_Relative";
    if (key === "Family_History_High_Cholesterol") return "Family_History_High_Cholesterol_Relative";
    if (key === "Family_History_Stroke") return "Family_History_Stroke_Relative";
    if (key === "Family_History_Kidney_Disease") return "Family_History_Kidney_Disease_Relative";
    if (key === "Family_History_Cancer") return "Family_History_Cancer_Relative";
    if (key === "Family_History_Sickle_Cell") return "Family_History_Sickle_Cell_Relative";
    if (key === "Family_History_Thalassemia") return "Family_History_Thalassemia_Relative";
    if (key === "Family_History_Asthma") return "Family_History_Asthma_Relative";
    return "";
  };

  const steps = [
    { number: 1, title: "Demographics", icon: User },
    { number: 2, title: "Vitals & Labs", icon: Heart },
    { number: 3, title: "Lifestyle", icon: Activity },
    { number: 4, title: "Family History", icon: Users },
    { number: 5, title: "Review & Predict", icon: CheckCircle }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Step {currentStep} of 5
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personal Health Risk Assessment
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete your health metrics to receive a confidential early risk assessment and personalized recommendations.
          </p>
        </div>

        {/* Reset / Clear Form action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Reset form to default values"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <React.Fragment key={s.number}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className={`flex items-center gap-2 text-left cursor-pointer group transition-all ${
                    isCurrent ? "scale-105" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                        : isCompleted
                        ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isCompleted ? "✓" : s.number}
                  </div>
                  <span
                    className={`hidden md:inline text-xs font-bold ${
                      isCurrent
                        ? "text-slate-900 dark:text-white"
                        : isCompleted
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                      currentStep > s.number ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Form Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        {/* STEP 1: PATIENT DEMOGRAPHICS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Step 1: Patient Demographics</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter personal details, age, gender, and regional healthcare access.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Patient Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={form.Patient_Name || ""}
                    onChange={(e) => updateField("Patient_Name", e.target.value)}
                    placeholder="e.g. Rahul Sharma or Jane Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Used for generating your personal clinical report summary</span>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Location / City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={form.Location || ""}
                    onChange={(e) => updateField("Location", e.target.value)}
                    placeholder="e.g. Bangalore, India or Chicago, IL"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Regional healthcare context and infrastructure proximity</span>
              </div>

              {/* Age (Direct Keyboard Input) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Patient Age (Years)
                  </label>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    {form.Age} yrs
                  </span>
                </div>

                <div>
                  <input
                    type="number"
                    min="18"
                    max="105"
                    value={ageInputText}
                    onChange={handleAgeChange}
                    onBlur={handleAgeBlur}
                    placeholder="Type Age"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>

                {ageError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{ageError}</span>
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-400 block">Enter age using keyboard (18 - 105 yrs)</span>
                )}
              </div>

              {/* Gender Segmented Control */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Biological Sex / Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Male", "Female", "Other"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => updateField("Gender", gender)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        form.Gender === gender
                          ? "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 block">Used for sex-specific epidemiological risk calibration</span>
              </div>

              {/* Healthcare Access */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Healthcare System Access
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Easy", "Moderate", "Difficult"] as const).map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => updateField("Healthcare_Access", acc)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        form.Healthcare_Access === acc
                          ? "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">Proximity to emergency clinical and diagnostic facilities</span>
              </div>

              {/* Health Insurance */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Health Insurance Coverage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Yes", "No"] as const).map((ins) => (
                    <button
                      key={ins}
                      type="button"
                      onClick={() => updateField("Health_Insurance", ins)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        form.Health_Insurance === ins
                          ? "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {ins === "Yes" ? "Insured" : "Uninsured"}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">Coverage for preventive checkups and follow-ups</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: VITALS & LABS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <span>Step 2: Vitals &amp; Laboratory Biomarkers</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cardiovascular and metabolic parameters measured during a routine checkup.
                </p>
              </div>

              {/* Toggle height/weight calculator */}
              <button
                type="button"
                onClick={() => setUseHeightWeight(!useHeightWeight)}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-teal-500" />
                <span>{useHeightWeight ? "Manual BMI Slider" : "Height/Weight Calculator"}</span>
              </button>
            </div>

            {/* Height/Weight Calculator Sub-panel */}
            {useHeightWeight && (
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-teal-900 dark:text-teal-200">Height (cm)</label>
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-900 rounded-xl border border-teal-300 dark:border-teal-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-teal-900 dark:text-teal-200">Weight (kg)</label>
                  <input
                    type="number"
                    min="30"
                    max="220"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-white dark:bg-slate-900 rounded-xl border border-teal-300 dark:border-teal-700 text-sm font-bold"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-teal-900 dark:text-teal-200">Computed BMI</span>
                  <span className="text-xl font-extrabold text-teal-700 dark:text-teal-300 mt-1">
                    {form.BMI} kg/m²
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* BMI Keyboard Input */}
              {!useHeightWeight && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Body Mass Index (BMI)
                    </label>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                      {form.BMI.toFixed(1)} kg/m²
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={bmiInputText}
                      onChange={handleBmiChange}
                      onBlur={handleBmiBlur}
                      placeholder="e.g. 24.5"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                    />
                  </div>
                  {bmiError ? (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{bmiError}</span>
                    </p>
                  ) : (
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Underweight &lt;18.5</span>
                      <span>Normal 18.5-24.9</span>
                      <span>Overweight 25-29.9</span>
                      <span>Obese ≥30</span>
                    </div>
                  )}
                </div>
              )}

              {/* Systolic BP Keyboard Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Systolic BP (mmHg)
                  </label>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg border ${
                      form.Systolic_BP >= 180
                        ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 animate-pulse"
                        : form.Systolic_BP >= 140
                        ? "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300"
                    }`}
                  >
                    {form.Systolic_BP} mmHg
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="70"
                    max="240"
                    value={sbpInputText}
                    onChange={handleSbpChange}
                    onBlur={handleSbpBlur}
                    placeholder="e.g. 120"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                {sbpError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{sbpError}</span>
                  </p>
                ) : form.Systolic_BP >= 180 ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Hypertensive Crisis Alert (≥ 180 mmHg)
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-400">Normal: &lt; 120 • Stage 2: ≥ 140 mmHg</span>
                )}
              </div>

              {/* Diastolic BP Keyboard Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Diastolic BP (mmHg)
                  </label>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    {form.Diastolic_BP} mmHg
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="40"
                    max="150"
                    value={dbpInputText}
                    onChange={handleDbpChange}
                    onBlur={handleDbpBlur}
                    placeholder="e.g. 80"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                {dbpError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{dbpError}</span>
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-400">Normal: &lt; 80 mmHg • Elevated: ≥ 90 mmHg</span>
                )}
              </div>

              {/* Fasting Blood Glucose Keyboard Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Fasting Blood Glucose (mg/dL)
                  </label>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg border ${
                      form.Blood_Glucose >= 250
                        ? "bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
                        : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300"
                    }`}
                  >
                    {form.Blood_Glucose} mg/dL
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="50"
                    max="400"
                    value={glucoseInputText}
                    onChange={handleGlucoseChange}
                    onBlur={handleGlucoseBlur}
                    placeholder="e.g. 95"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                {glucoseError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{glucoseError}</span>
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-400">Normal: 70 - 99 mg/dL • Diabetic threshold: ≥ 126 mg/dL</span>
                )}
              </div>

              {/* Total Serum Cholesterol Keyboard Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Total Serum Cholesterol (mg/dL)
                  </label>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    {form.Cholesterol} mg/dL
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="80"
                    max="500"
                    value={cholInputText}
                    onChange={handleCholChange}
                    onBlur={handleCholBlur}
                    placeholder="e.g. 185"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                {cholError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{cholError}</span>
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-400">Desirable: &lt; 200 mg/dL • High: ≥ 240 mg/dL</span>
                )}
              </div>

              {/* Resting Heart Rate Keyboard Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Resting Heart Rate (BPM)
                  </label>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    {form.Heart_Rate} bpm
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="40"
                    max="180"
                    value={hrInputText}
                    onChange={handleHrChange}
                    onBlur={handleHrBlur}
                    placeholder="e.g. 72"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                {hrError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{hrError}</span>
                  </p>
                ) : (
                  <span className="text-[11px] text-slate-400">Normal adult resting rate: 60 - 100 beats/min</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LIFESTYLE & BEHAVIOR */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-500" />
                <span>Step 3: Lifestyle Habits &amp; Behaviors</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Daily exercise, dietary patterns, sleep duration, and substance use.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Smoking Status */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tobacco / Smoking Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Never", "Former", "Current"] as const).map((smk) => (
                    <button
                      key={smk}
                      type="button"
                      onClick={() => updateField("Smoking_Status", smk)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        form.Smoking_Status === smk
                          ? "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {smk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alcohol Consumption */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Alcohol Consumption
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["No", "Occasional", "Frequent"] as const).map((alc) => (
                    <button
                      key={alc}
                      type="button"
                      onClick={() => updateField("Alcohol_Use", alc)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        form.Alcohol_Use === alc
                          ? "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {alc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Activity Days Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Physical Exercise (Days/Week)
                  </label>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-base bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    {form.Physical_Activity_Days} days
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={form.Physical_Activity_Days}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(7, Number(e.target.value)));
                      updateField("Physical_Activity_Days", val);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-400">At least 30 minutes of moderate aerobic or resistance activity (0 - 7 days)</span>
              </div>

              {/* Sleep Hours Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Average Sleep (Hours/Night)
                  </label>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-base bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                    {form.Sleep_Hours.toFixed(1)} hrs
                  </span>
                </div>
                <div>
                  <input
                    type="number"
                    min="3.5"
                    max="10.0"
                    step="0.5"
                    value={form.Sleep_Hours}
                    onChange={(e) => {
                      const val = Math.max(3.5, Math.min(10.0, Number(e.target.value)));
                      updateField("Sleep_Hours", val);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Optimal adult restorative range: 7.0 - 8.5 hours</span>
              </div>

              {/* Diet Quality */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Diet Quality &amp; Nutritional Pattern
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Poor", "Average", "Good"] as const).map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => updateField("Diet_Quality", diet)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        form.Diet_Quality === diet
                          ? "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-sm">{diet}</span>
                      <span className="text-[10px] font-normal opacity-85">
                        {diet === "Good" ? "High fiber, lean protein, balanced" : diet === "Average" ? "Mixed routine" : "Processed, high sodium & sugar"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FAMILY MEDICAL HISTORY */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Step 4: Family Medical History</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Indicate family medical background for hereditary risk assessment. Specify Yes, No, or Unknown, and affected relatives if applicable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "Family_History_Heart_Disease", label: "Heart Disease", desc: "Coronary artery disease, myocardial infarction, angina" },
                { key: "Family_History_Diabetes", label: "Diabetes Mellitus", desc: "Type 1 or Type 2 diabetes history" },
                { key: "Family_History_High_BP", label: "High Blood Pressure", desc: "Chronic hypertension or vascular pressure" },
                { key: "Family_History_High_Cholesterol", label: "High Cholesterol", desc: "Hyperlipidemia or dyslipidemia" },
                { key: "Family_History_Stroke", label: "Stroke / TIA", desc: "Cerebrovascular accident or transient attack" },
                { key: "Family_History_Kidney_Disease", label: "Kidney Disease (CKD)", desc: "Chronic renal impairment or dialysis" },
                { key: "Family_History_Cancer", label: "History of Cancer", desc: "Any diagnosed familial malignancy" },
                { key: "Family_History_Sickle_Cell", label: "Sickle Cell Disease", desc: "Sickle cell anemia or trait" },
                { key: "Family_History_Thalassemia", label: "Thalassemia", desc: "Alpha or beta thalassemia trait/disease" },
                { key: "Family_History_Asthma", label: "Asthma / Respiratory", desc: "Chronic respiratory conditions" }
              ].map(({ key, label, desc }) => {
                const val = form[key as keyof PatientInput] as number; // 1 = Yes, 0 = No, -1 or undefined = Unknown
                const isYes = val === 1;
                const isNo = val === 0;
                const isUnknown = val === undefined || val === -1;
                const relKey = getRelKey(key);
                const relativeVal = (form[relKey as keyof PatientInput] as string) || "Parent";

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-2xl border transition-all ${
                      isYes
                        ? "bg-teal-50/70 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{label}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateField(key as any, 1)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isYes
                              ? "bg-teal-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField(key as any, 0)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isNo
                              ? "bg-slate-700 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField(key as any, -1 as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isUnknown
                              ? "bg-amber-600 text-white shadow-xs"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          Unknown
                        </button>
                      </div>
                    </div>

                    {isYes && relKey && (
                      <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-800/60 flex items-center gap-2 animate-in fade-in duration-200">
                        <span className="text-xs font-semibold text-teal-900 dark:text-teal-300 shrink-0">Affected Relative:</span>
                        <select
                          value={relativeVal}
                          onChange={(e) => updateField(relKey as any, e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                          <option value="Parent">Parent (Mother/Father)</option>
                          <option value="Sibling">Sibling (Brother/Sister)</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Multiple Relatives">Multiple Relatives</option>
                          <option value="Other Family Member">Other Family Member</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & PREDICT */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span>Step 5: Review &amp; Run Risk Assessment</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please verify your details before running the predictive assessment engine.
              </p>
            </div>

            {/* Quick summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Patient Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate block">
                  {form.Patient_Name || "Not provided"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Age / Gender</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {form.Age} yrs, {form.Gender}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Blood Pressure</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {form.Systolic_BP}/{form.Diastolic_BP} mmHg
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Location</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate block">
                  {form.Location || "Not provided"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Fasting Glucose</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {form.Blood_Glucose} mg/dL
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Total Cholesterol</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {form.Cholesterol} mg/dL
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Body Mass Index</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {form.BMI} kg/m²
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Heart Rate</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {form.Heart_Rate} bpm
                </span>
              </div>
            </div>

            {/* Family Medical History summary tags */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Reported Family Medical History:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "Family_History_Heart_Disease", label: "Heart Disease" },
                  { key: "Family_History_Diabetes", label: "Diabetes" },
                  { key: "Family_History_High_BP", label: "High Blood Pressure" },
                  { key: "Family_History_High_Cholesterol", label: "High Cholesterol" },
                  { key: "Family_History_Stroke", label: "Stroke" },
                  { key: "Family_History_Kidney_Disease", label: "Kidney Disease" },
                  { key: "Family_History_Cancer", label: "Cancer" },
                  { key: "Family_History_Sickle_Cell", label: "Sickle Cell" },
                  { key: "Family_History_Thalassemia", label: "Thalassemia" },
                  { key: "Family_History_Asthma", label: "Asthma" }
                ].filter(({ key }) => form[key as keyof PatientInput] === 1).map(({ key, label }) => {
                  const relKey = getRelKey(key);
                  const rel = (form[relKey as keyof PatientInput] as string) || "";
                  return (
                    <span key={label} className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs">
                      {label} {rel ? `(${rel})` : ""}
                    </span>
                  );
                })}
                {![
                  form.Family_History_Heart_Disease,
                  form.Family_History_Diabetes,
                  form.Family_History_High_BP,
                  form.Family_History_High_Cholesterol,
                  form.Family_History_Stroke,
                  form.Family_History_Kidney_Disease,
                  form.Family_History_Cancer,
                  form.Family_History_Sickle_Cell,
                  form.Family_History_Thalassemia,
                  form.Family_History_Asthma
                ].some(v => v === 1) && (
                  <span className="text-xs text-slate-400 italic">No family conditions reported with Yes.</span>
                )}
              </div>
            </div>

            {/* Launch button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-base shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Analyzing Health Indicators...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-teal-200" />
                    <span>Run ArogyaAI Risk Assessment</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              currentStep === 1
                ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-semibold">Ready to generate report</span>
          )}
        </div>
      </div>
    </div>
  );
};
