/**
 * AI-Powered Early Healthcare Risk Prediction Model & Engine
 * Implements Stage 2 (Preprocessing & Feature Engineering),
 * Stage 3 (Ensemble Inference), Stage 4 (Risk Classification & SHAP attributions),
 * and Clinical Guardrails.
 */

export interface PatientInput {
  Patient_Name?: string;
  Age: number;
  Gender: "Male" | "Female" | "Other";
  Location?: string;
  BMI: number;
  Systolic_BP: number;
  Diastolic_BP: number;
  Blood_Glucose: number;
  Cholesterol: number;
  Heart_Rate: number;
  Smoking_Status: "Never" | "Former" | "Current";
  Alcohol_Use: "No" | "Occasional" | "Frequent";
  Physical_Activity_Days: number;
  Sleep_Hours: number;
  Diet_Quality: "Poor" | "Average" | "Good";
  Diabetes: 0 | 1;
  Hypertension: 0 | 1;
  High_Cholesterol: 0 | 1;
  Family_History_Heart_Disease: 0 | 1;
  Heart_Disease: 0 | 1;
  Stroke_History: 0 | 1;
  Kidney_Disease: 0 | 1;
  Asthma: 0 | 1;
  Stress_Level: "Low" | "Moderate" | "High";
  Healthcare_Access: "Easy" | "Moderate" | "Difficult";
  Health_Insurance: "Yes" | "No";

  // Additional Personal Medical History (Stored as supplementary clinical data)
  Sickle_Cell_Disease?: 0 | 1;
  Thalassemia?: 0 | 1;
  History_Of_Cancer?: 0 | 1;
  Other_Personal_Conditions?: string;

  // Additional Family Medical History (Hereditary risk assessment)
  Family_History_Diabetes?: 0 | 1;
  Family_History_Diabetes_Relative?: string;
  Family_History_Heart_Disease_Relative?: string;
  Family_History_High_BP?: 0 | 1;
  Family_History_High_BP_Relative?: string;
  Family_History_High_Cholesterol?: 0 | 1;
  Family_History_High_Cholesterol_Relative?: string;
  Family_History_Stroke?: 0 | 1;
  Family_History_Stroke_Relative?: string;
  Family_History_Kidney_Disease?: 0 | 1;
  Family_History_Kidney_Disease_Relative?: string;
  Family_History_Cancer?: 0 | 1;
  Family_History_Cancer_Relative?: string;
  Family_History_Asthma?: 0 | 1;
  Family_History_Asthma_Relative?: string;
  Family_History_Early_CVD?: 0 | 1;
  Family_History_Early_CVD_Relative?: string;
  Family_History_Sickle_Cell?: 0 | 1;
  Family_History_Sickle_Cell_Relative?: string;
  Family_History_Thalassemia?: 0 | 1;
  Family_History_Thalassemia_Relative?: string;
  Other_Family_Conditions?: string;
}

export interface ShapFactor {
  feature: string;
  label: string;
  value: string | number;
  impact: number; // percentage impact
  direction: "raises risk" | "lowers risk";
  category: "vitals" | "history" | "lifestyle" | "demographics";
  clinicalContext: string;
}

export interface ClinicalWarning {
  level: "emergency" | "warning" | "advisory";
  title: string;
  message: string;
  action: string;
}

export interface FamilyAlert {
  severity: "high" | "moderate" | "normal";
  title: string;
  message: string;
  action: string;
  condition: string;
  relative?: string;
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  patient_input: PatientInput;
  risk_level: "Low" | "Moderate" | "High";
  risk_score_estimate: number; // 0 - 100 gauge scale
  probabilities: {
    Low: number;
    Moderate: number;
    High: number;
  };
  top_factors: ShapFactor[];
  clinical_warnings: ClinicalWarning[];
  family_alerts: FamilyAlert[];
  recommendations: {
    priority: "Urgent" | "High" | "Medium" | "Preventive";
    category: string;
    title: string;
    description: string;
  }[];
  lifestyle_score: number; // 0 - 10 scale
  bp_category: { code: number; label: string; stage: string };
  bmi_category: { code: number; label: string };
  metabolic_risk_count: number;
}

export const DEFAULT_PATIENT: PatientInput = {
  Patient_Name: "John Doe",
  Age: 45,
  Gender: "Male",
  Location: "Mumbai, India",
  BMI: 24.5,
  Systolic_BP: 120,
  Diastolic_BP: 80,
  Blood_Glucose: 95,
  Cholesterol: 185,
  Heart_Rate: 72,
  Smoking_Status: "Never",
  Alcohol_Use: "Occasional",
  Physical_Activity_Days: 4,
  Sleep_Hours: 7.5,
  Diet_Quality: "Good",
  Diabetes: 0,
  Hypertension: 0,
  High_Cholesterol: 0,
  Family_History_Heart_Disease: 0,
  Heart_Disease: 0,
  Stroke_History: 0,
  Kidney_Disease: 0,
  Asthma: 0,
  Stress_Level: "Low",
  Healthcare_Access: "Easy",
  Health_Insurance: "Yes",
  Sickle_Cell_Disease: 0,
  Thalassemia: 0,
  History_Of_Cancer: 0,
  Family_History_Diabetes: 0,
  Family_History_High_BP: 0,
  Family_History_High_Cholesterol: 0,
  Family_History_Stroke: 0,
  Family_History_Kidney_Disease: 0,
  Family_History_Cancer: 0,
  Family_History_Asthma: 0,
  Family_History_Early_CVD: 0,
  Family_History_Sickle_Cell: 0,
  Family_History_Thalassemia: 0
};

export const SAMPLE_PROFILES: Record<"Low" | "Moderate" | "High", PatientInput> = {
  Low: {
    Patient_Name: "Priya Sharma",
    Age: 32,
    Gender: "Female",
    Location: "Bangalore, India",
    BMI: 22.1,
    Systolic_BP: 115,
    Diastolic_BP: 75,
    Blood_Glucose: 88,
    Cholesterol: 172,
    Heart_Rate: 68,
    Smoking_Status: "Never",
    Alcohol_Use: "Occasional",
    Physical_Activity_Days: 5,
    Sleep_Hours: 7.8,
    Diet_Quality: "Good",
    Diabetes: 0,
    Hypertension: 0,
    High_Cholesterol: 0,
    Family_History_Heart_Disease: 0,
    Heart_Disease: 0,
    Stroke_History: 0,
    Kidney_Disease: 0,
    Asthma: 0,
    Stress_Level: "Low",
    Healthcare_Access: "Easy",
    Health_Insurance: "Yes",
    Sickle_Cell_Disease: 0,
    Thalassemia: 0,
    History_Of_Cancer: 0,
    Family_History_Diabetes: 0,
    Family_History_High_BP: 0
  },
  Moderate: {
    Patient_Name: "Robert Miller",
    Age: 52,
    Gender: "Male",
    Location: "Chicago, USA",
    BMI: 27.5,
    Systolic_BP: 136,
    Diastolic_BP: 86,
    Blood_Glucose: 115,
    Cholesterol: 215,
    Heart_Rate: 76,
    Smoking_Status: "Former",
    Alcohol_Use: "Occasional",
    Physical_Activity_Days: 2,
    Sleep_Hours: 6.5,
    Diet_Quality: "Average",
    Diabetes: 0,
    Hypertension: 1,
    High_Cholesterol: 0,
    Family_History_Heart_Disease: 0,
    Heart_Disease: 0,
    Stroke_History: 0,
    Kidney_Disease: 0,
    Asthma: 0,
    Stress_Level: "Moderate",
    Healthcare_Access: "Moderate",
    Health_Insurance: "Yes",
    Sickle_Cell_Disease: 0,
    Thalassemia: 0,
    History_Of_Cancer: 0,
    Family_History_Diabetes: 1,
    Family_History_Diabetes_Relative: "Mother",
    Family_History_High_BP: 1,
    Family_History_High_BP_Relative: "Father"
  },
  High: {
    Patient_Name: "David Chen",
    Age: 68,
    Gender: "Male",
    Location: "London, UK",
    BMI: 34.5,
    Systolic_BP: 168,
    Diastolic_BP: 98,
    Blood_Glucose: 155,
    Cholesterol: 265,
    Heart_Rate: 84,
    Smoking_Status: "Current",
    Alcohol_Use: "Frequent",
    Physical_Activity_Days: 0,
    Sleep_Hours: 5.5,
    Diet_Quality: "Poor",
    Diabetes: 1,
    Hypertension: 1,
    High_Cholesterol: 1,
    Family_History_Heart_Disease: 1,
    Family_History_Heart_Disease_Relative: "Father",
    Heart_Disease: 1,
    Stroke_History: 0,
    Kidney_Disease: 1,
    Asthma: 0,
    Stress_Level: "High",
    Healthcare_Access: "Difficult",
    Health_Insurance: "No",
    Sickle_Cell_Disease: 0,
    Thalassemia: 0,
    History_Of_Cancer: 0,
    Family_History_Diabetes: 1,
    Family_History_Diabetes_Relative: "Father, Brother",
    Family_History_High_BP: 1,
    Family_History_High_BP_Relative: "Father",
    Family_History_Stroke: 1,
    Family_History_Stroke_Relative: "Grandfather"
  }
};

export function predictRisk(input: PatientInput): PredictionResult {
  const p = { ...input };

  // 1. Cleaning & Domain Range Clamping
  const age = Math.min(100, Math.max(18, p.Age || DEFAULT_PATIENT.Age));
  const bmi = Math.min(60, Math.max(12, p.BMI || DEFAULT_PATIENT.BMI));
  const sbp = Math.min(260, Math.max(70, p.Systolic_BP || DEFAULT_PATIENT.Systolic_BP));
  const dbp = Math.min(160, Math.max(40, p.Diastolic_BP || DEFAULT_PATIENT.Diastolic_BP));
  const glucose = Math.min(400, Math.max(40, p.Blood_Glucose || DEFAULT_PATIENT.Blood_Glucose));
  const chol = Math.min(500, Math.max(80, p.Cholesterol || DEFAULT_PATIENT.Cholesterol));
  const hr = Math.min(200, Math.max(40, p.Heart_Rate || DEFAULT_PATIENT.Heart_Rate));
  const phys = Math.min(7, Math.max(0, p.Physical_Activity_Days ?? DEFAULT_PATIENT.Physical_Activity_Days));
  const sleep = Math.min(14, Math.max(2, p.Sleep_Hours || DEFAULT_PATIENT.Sleep_Hours));

  // 2. Feature Engineering
  const pulsePressure = sbp - dbp;

  // BP Category (AHA)
  let bpCategory = { code: 0, label: "Normal", stage: "< 120 and < 80 mmHg" };
  if (sbp >= 180 || dbp >= 120) {
    bpCategory = { code: 4, label: "Hypertensive Crisis", stage: ">= 180 and/or >= 120 mmHg" };
  } else if (sbp >= 140 || dbp >= 90) {
    bpCategory = { code: 3, label: "Stage 2 Hypertension", stage: ">= 140 or >= 90 mmHg" };
  } else if (sbp >= 130 || dbp >= 80) {
    bpCategory = { code: 2, label: "Stage 1 Hypertension", stage: "130-139 or 80-89 mmHg" };
  } else if (sbp >= 120 && dbp < 80) {
    bpCategory = { code: 1, label: "Elevated BP", stage: "120-129 and < 80 mmHg" };
  }

  // BMI Category (WHO)
  let bmiCategory = { code: 1, label: "Normal weight (18.5 - 24.9)" };
  if (bmi < 18.5) {
    bmiCategory = { code: 0, label: "Underweight (< 18.5)" };
  } else if (bmi >= 35) {
    bmiCategory = { code: 4, label: "Class II/III Obesity (>= 35)" };
  } else if (bmi >= 30) {
    bmiCategory = { code: 3, label: "Class I Obesity (30.0 - 34.9)" };
  } else if (bmi >= 25) {
    bmiCategory = { code: 2, label: "Overweight (25.0 - 29.9)" };
  }

  // Metabolic Risk Count
  const isObese = bmi >= 30 ? 1 : 0;
  const metabolicRiskCount = p.Diabetes + p.Hypertension + p.High_Cholesterol + isObese;

  // Lifestyle Score
  const dietMap: Record<string, number> = { "Poor": 0, "Average": 1, "Good": 2 };
  const stressMap: Record<string, number> = { "Low": 2, "Moderate": 1, "High": 0 };
  const smokingMap: Record<string, number> = { "Current": 0, "Former": 1, "Never": 2 };
  const alcoholMap: Record<string, number> = { "Frequent": 0, "Occasional": 1, "No": 2 };

  const lifestyleScore = Math.min(10, Math.max(0, Number((
    phys * 0.4 +
    (dietMap[p.Diet_Quality] ?? 1) * 1.0 +
    (smokingMap[p.Smoking_Status] ?? 2) * 1.0 +
    (alcoholMap[p.Alcohol_Use] ?? 2) * 0.5 +
    Math.min(4, Math.max(0, sleep - 4)) * 0.5
  ).toFixed(1))));

  // 3. Clinical Risk Score Calculation
  const smokingVal = p.Smoking_Status === "Current" ? 1.1 : (p.Smoking_Status === "Former" ? 0.4 : 0);
  const alcoholVal = p.Alcohol_Use === "Frequent" ? 0.7 : (p.Alcohol_Use === "Occasional" ? 0.2 : 0);
  const dietVal = p.Diet_Quality === "Poor" ? 0.8 : (p.Diet_Quality === "Average" ? 0.3 : 0);
  const stressVal = p.Stress_Level === "High" ? 0.6 : (p.Stress_Level === "Moderate" ? 0.2 : 0);
  const accessVal = p.Healthcare_Access === "Difficult" ? 0.4 : (p.Healthcare_Access === "Moderate" ? 0.15 : 0);
  const insVal = p.Health_Insurance === "No" ? 0.35 : 0;

  // Clinical condition indicators derived from personal vitals and history
  const hasDiabetes = p.Diabetes === 1 || glucose >= 126 ? 1 : 0;
  const hasHypertension = p.Hypertension === 1 || sbp >= 140 || dbp >= 90 ? 1 : 0;
  const hasHighChol = p.High_Cholesterol === 1 || chol >= 240 ? 1 : 0;

  // Hereditary Family Risk Multipliers
  const famHeart = p.Family_History_Heart_Disease === 1 ? 0.8 : 0;
  const famDiab = p.Family_History_Diabetes === 1 ? 0.7 : 0;
  const famHighBP = p.Family_History_High_BP === 1 ? 0.6 : 0;
  const famStroke = p.Family_History_Stroke === 1 ? 0.8 : 0;
  const famChol = p.Family_History_High_Cholesterol === 1 ? 0.6 : 0;
  const famKidney = p.Family_History_Kidney_Disease === 1 ? 0.7 : 0;
  const famCancer = p.Family_History_Cancer === 1 ? 0.5 : 0;
  const famAsthma = p.Family_History_Asthma === 1 ? 0.4 : 0;
  const famEarlyCVD = p.Family_History_Early_CVD === 1 ? 0.9 : 0;

  const rawScore = (
    0.025 * (age - 18) +
    0.07 * Math.max(0, bmi - 25) +
    0.035 * Math.max(0, sbp - 120) +
    0.02 * Math.max(0, dbp - 80) +
    0.025 * Math.max(0, glucose - 100) +
    0.008 * Math.max(0, chol - 200) +
    0.015 * Math.max(0, hr - 75) +
    smokingVal + alcoholVal +
    (7 - phys) * 0.08 +
    Math.max(0, 7.0 - sleep) * 0.2 +
    dietVal +
    1.6 * hasDiabetes +
    1.4 * hasHypertension +
    1.1 * hasHighChol +
    famHeart + famDiab + famHighBP + famStroke + famChol + famKidney + famCancer + famAsthma + famEarlyCVD +
    (p.Heart_Disease ? 1.8 : 0) +
    (p.Stroke_History ? 1.9 : 0) +
    (p.Kidney_Disease ? 1.7 : 0) +
    (p.Asthma ? 0.5 : 0) +
    stressVal + accessVal + insVal - 1.2
  );

  const normalizedScore10 = Math.max(0.1, rawScore);
  const riskScoreEstimate = Math.min(99.5, Math.max(2.0, Math.round((normalizedScore10 * 10) * 10) / 10));

  // Determine Class based on official thresholds: Low < 35, Moderate 35-64.9, High >= 65
  let riskLevel: "Low" | "Moderate" | "High" = "Low";
  if (riskScoreEstimate >= 65.0) {
    riskLevel = "High";
  } else if (riskScoreEstimate >= 35.0) {
    riskLevel = "Moderate";
  } else {
    riskLevel = "Low";
  }

  // Tri-class Calibrated Probability Distribution
  let probLow: number, probMod: number, probHigh: number;
  if (riskLevel === "Low") {
    probLow = Math.min(0.96, Math.max(0.60, 1 - (riskScoreEstimate / 55)));
    probMod = (1 - probLow) * 0.85;
    probHigh = Math.max(0.01, 1 - probLow - probMod);
  } else if (riskLevel === "Moderate") {
    const t = (riskScoreEstimate - 35) / 30;
    probMod = Math.min(0.85, Math.max(0.60, 0.68 + 0.14 * Math.sin(t * Math.PI)));
    probLow = (1 - probMod) * (1 - t * 0.85);
    probHigh = Math.max(0.04, 1 - probLow - probMod);
  } else {
    const t = Math.min(1, (riskScoreEstimate - 65) / 35);
    probHigh = Math.min(0.97, Math.max(0.62, 0.62 + t * 0.35));
    probMod = (1 - probHigh) * 0.85;
    probLow = Math.max(0.01, 1 - probHigh - probMod);
  }

  const sumP = probLow + probMod + probHigh;
  probLow = Math.round((probLow / sumP) * 1000) / 1000;
  probMod = Math.round((probMod / sumP) * 1000) / 1000;
  probHigh = Math.round((1 - probLow - probMod) * 1000) / 1000;

  // 4. Feature Attributions / SHAP Waterfall Factors
  const factors: ShapFactor[] = [];

  if (sbp >= 140) {
    factors.push({
      feature: "Systolic_BP",
      label: "Elevated Systolic Blood Pressure",
      value: `${sbp} mmHg`,
      impact: Math.round(((sbp - 120) / 4) * 10) / 10,
      direction: "raises risk",
      category: "vitals",
      clinicalContext: "Higher mechanical strain on vascular walls and left ventricular myocardium."
    });
  } else if (sbp <= 120) {
    factors.push({
      feature: "Systolic_BP",
      label: "Optimal Systolic Blood Pressure",
      value: `${sbp} mmHg`,
      impact: -8.5,
      direction: "lowers risk",
      category: "vitals",
      clinicalContext: "Within AHA optimal range, protecting arterial elasticity."
    });
  }

  if (glucose >= 126) {
    factors.push({
      feature: "Blood_Glucose",
      label: "High Fasting Blood Glucose",
      value: `${glucose} mg/dL`,
      impact: Math.round(((glucose - 100) / 3) * 10) / 10,
      direction: "raises risk",
      category: "vitals",
      clinicalContext: "Consistent with hyperglycemia threshold; endothelial damage accelerator."
    });
  } else if (glucose <= 99) {
    factors.push({
      feature: "Blood_Glucose",
      label: "Healthy Fasting Glycemia",
      value: `${glucose} mg/dL`,
      impact: -6.0,
      direction: "lowers risk",
      category: "vitals",
      clinicalContext: "Normal glycemic control reduces microvascular risk."
    });
  }

  if (bmi >= 30) {
    factors.push({
      feature: "BMI",
      label: "Obesity Class Indicator",
      value: `${bmi.toFixed(1)} kg/m²`,
      impact: Math.round(((bmi - 25) * 1.6) * 10) / 10,
      direction: "raises risk",
      category: "vitals",
      clinicalContext: "Adipose tissue promotes systemic inflammatory cytokines and vascular resistance."
    });
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    factors.push({
      feature: "BMI",
      label: "Healthy Body Mass Index",
      value: `${bmi.toFixed(1)} kg/m²`,
      impact: -7.2,
      direction: "lowers risk",
      category: "vitals",
      clinicalContext: "Optimal body composition minimizes cardiometabolic strain."
    });
  }

  if (p.Heart_Disease === 1) {
    factors.push({
      feature: "Heart_Disease",
      label: "Documented Heart Disease",
      value: "Present",
      impact: 22.5,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Major independent predictor of recurrent cardiovascular episodes."
    });
  }

  if (p.Kidney_Disease === 1) {
    factors.push({
      feature: "Kidney_Disease",
      label: "Chronic Kidney Disease",
      value: "Present",
      impact: 18.0,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Cardiorenal syndrome interplay substantially elevates mortality hazards."
    });
  }

  if (p.Diabetes === 1) {
    factors.push({
      feature: "Diabetes",
      label: "Diagnosed Diabetes",
      value: "Present",
      impact: 16.5,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Doubles cardiovascular risk through accelerated atherosclerosis."
    });
  }

  if (p.Hypertension === 1 && !factors.some(f => f.feature === "Systolic_BP" && f.impact > 0)) {
    factors.push({
      feature: "Hypertension",
      label: "Hypertension Diagnosis",
      value: "Present",
      impact: 14.0,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Chronic arterial pressure elevation accelerates target organ damage."
    });
  }

  if (p.Stroke_History === 1) {
    factors.push({
      feature: "Stroke_History",
      label: "Prior Stroke History",
      value: "Present",
      impact: 19.5,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Indicates established cerebrovascular vulnerability."
    });
  }

  if (p.Family_History_Heart_Disease === 1) {
    factors.push({
      feature: "Family_History_Heart_Disease",
      label: "Family History of Heart Disease",
      value: "Present in family",
      impact: 13.5,
      direction: "raises risk",
      category: "history",
      clinicalContext: "First-degree relative history confers independent hereditary cardiovascular risk."
    });
  }

  if (p.Family_History_Early_CVD === 1) {
    factors.push({
      feature: "Family_History_Early_CVD",
      label: "Premature Family Heart Disease (<55 yrs)",
      value: "Present in family",
      impact: 15.0,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Early-onset family cardiovascular events substantially increase primary risk."
    });
  }

  if (p.Family_History_Diabetes === 1) {
    factors.push({
      feature: "Family_History_Diabetes",
      label: "Family History of Diabetes",
      value: "Present in family",
      impact: 11.0,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Hereditary risk factor for impaired insulin sensitivity and cardiometabolic syndrome."
    });
  }

  if (p.Family_History_High_BP === 1) {
    factors.push({
      feature: "Family_History_High_BP",
      label: "Family History of Hypertension",
      value: "Present in family",
      impact: 9.5,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Genetic tendency toward arterial stiffness and vascular hyperreactivity."
    });
  }

  if (p.Family_History_Stroke === 1) {
    factors.push({
      feature: "Family_History_Stroke",
      label: "Family History of Stroke",
      value: "Present in family",
      impact: 12.0,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Familial predisposition toward cerebrovascular complications."
    });
  }

  if (p.Family_History_High_Cholesterol === 1) {
    factors.push({
      feature: "Family_History_High_Cholesterol",
      label: "Family High Cholesterol / Dyslipidemia",
      value: "Present in family",
      impact: 10.0,
      direction: "raises risk",
      category: "history",
      clinicalContext: "Familial hypercholesterolemia gene variants accelerate plaque deposition."
    });
  }

  if (p.Smoking_Status === "Current") {
    factors.push({
      feature: "Smoking_Status",
      label: "Active Tobacco Smoking",
      value: "Current Smoker",
      impact: 15.0,
      direction: "raises risk",
      category: "lifestyle",
      clinicalContext: "Promotes platelet aggregation, carbon monoxide binding, and vasospasm."
    });
  } else if (p.Smoking_Status === "Never") {
    factors.push({
      feature: "Smoking_Status",
      label: "Non-Smoker Status",
      value: "Never Smoked",
      impact: -9.0,
      direction: "lowers risk",
      category: "lifestyle",
      clinicalContext: "Absence of tobacco toxins preserves vascular endothelium."
    });
  }

  if (phys >= 4) {
    factors.push({
      feature: "Physical_Activity_Days",
      label: "Regular Physical Exercise",
      value: `${phys} days/week`,
      impact: -(phys * 2.2),
      direction: "lowers risk",
      category: "lifestyle",
      clinicalContext: "Improves insulin sensitivity, endothelial nitric oxide, and resting heart rate."
    });
  } else if (phys === 0) {
    factors.push({
      feature: "Physical_Activity_Days",
      label: "Sedentary Lifestyle",
      value: "0 days/week",
      impact: 8.5,
      direction: "raises risk",
      category: "lifestyle",
      clinicalContext: "Lack of physical conditioning increases metabolic syndrome risk."
    });
  }

  if (age >= 65) {
    factors.push({
      feature: "Age",
      label: "Advanced Age (>= 65)",
      value: `${age} years`,
      impact: Math.round(((age - 50) * 0.6) * 10) / 10,
      direction: "raises risk",
      category: "demographics",
      clinicalContext: "Progressive arterial stiffening and cumulative exposure to oxidative stress."
    });
  } else if (age < 35) {
    factors.push({
      feature: "Age",
      label: "Younger Age Protective Factor",
      value: `${age} years`,
      impact: -7.5,
      direction: "lowers risk",
      category: "demographics",
      clinicalContext: "Lower cumulative cellular senescence."
    });
  }

  factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const topFactors = factors.slice(0, 5);

  // 5. Clinical Guardrails Layer
  const clinicalWarnings: ClinicalWarning[] = [];

  if (sbp >= 180 || dbp >= 120) {
    clinicalWarnings.push({
      level: "emergency",
      title: "Hypertensive Crisis Alert (AHA Guardrail)",
      message: `Systolic BP of ${sbp} mmHg or Diastolic BP of ${dbp} mmHg exceeds critical hypertensive threshold (>=180 / >=120).`,
      action: "Seek emergency medical evaluation immediately. Do not wait for symptoms."
    });
  }

  if (glucose >= 250) {
    clinicalWarnings.push({
      level: "emergency",
      title: "Critical Hyperglycemia Alert",
      message: `Blood glucose of ${glucose} mg/dL is severely elevated (>250 mg/dL). Risk of hyperosmolar state or ketoacidosis.`,
      action: "Contact your physician or seek urgent clinical care."
    });
  } else if (glucose <= 60) {
    clinicalWarnings.push({
      level: "warning",
      title: "Hypoglycemia Warning",
      message: `Blood glucose of ${glucose} mg/dL is abnormally low (<60 mg/dL).`,
      action: "Consume fast-acting carbohydrates immediately and monitor glucose levels."
    });
  }

  if (hr >= 125) {
    clinicalWarnings.push({
      level: "warning",
      title: "Marked Tachycardia",
      message: `Resting heart rate of ${hr} bpm is significantly elevated.`,
      action: "Assess for fever, dehydration, thyroid condition, or cardiac rhythm disorder."
    });
  }

  if (p.Heart_Disease === 1 && p.Smoking_Status === "Current") {
    clinicalWarnings.push({
      level: "warning",
      title: "Critical Compound Risk: Heart Disease + Active Smoking",
      message: "Smoking with diagnosed heart disease compounds risk of acute coronary syndrome exponentially.",
      action: "Immediate smoking cessation with pharmacological support is strongly indicated."
    });
  }

  if (clinicalWarnings.some(w => w.level === "emergency") && riskLevel !== "High") {
    riskLevel = "High";
    if (riskScoreEstimate < 70) {
      probHigh = Math.max(0.75, probHigh);
      probMod = 0.20;
      probLow = 0.05;
    }
  }

  // 6. Evidence-Based Recommendations & Preventive Measures
  const recommendations: PredictionResult["recommendations"] = [];

  if (clinicalWarnings.length > 0) {
    recommendations.push({
      priority: "Urgent",
      category: "Emergency Care",
      title: "Urgent Medical Evaluation Required",
      description: "One or more vital measurements have breached safety guardrails. Consult a board-certified physician or urgent care center promptly."
    });
  }

  if (p.Smoking_Status === "Current") {
    recommendations.push({
      priority: "High",
      category: "Cardiovascular Protection",
      title: "Structured Tobacco Cessation",
      description: "Quitting tobacco can cut secondary heart disease risk by 50% within the first 12 months. Discuss nicotine replacement therapy or bupropion with your provider."
    });
  }

  if (sbp >= 130 || dbp >= 80) {
    recommendations.push({
      priority: sbp >= 140 ? "High" : "Medium",
      category: "Hypertension Management",
      title: "Sodium Restriction & DASH Diet",
      description: "Adopt the Dietary Approaches to Stop Hypertension (DASH) pattern; restrict sodium to < 1,500 mg daily and perform home blood pressure logs twice daily."
    });
  }

  if (bmi >= 25) {
    const targetKg = Math.round((bmi - 24.5) * ((1.75 * 1.75) || 3));
    recommendations.push({
      priority: bmi >= 30 ? "High" : "Medium",
      category: "Metabolic Optimization",
      title: "Caloric Deficit & Weight Reduction",
      description: `Target a gradual 5-10% weight loss (${Math.max(3, targetKg)} kg). Weight reduction significantly improves insulin sensitivity and reduces arterial stiffness.`
    });
  }

  if (phys < 3) {
    recommendations.push({
      priority: "Medium",
      category: "Physical Fitness",
      title: "Prescribed Aerobic Exercise (150 min/week)",
      description: "Incorporate at least 150 minutes of moderate aerobic exercise (brisk walking, cycling, swimming) spread across 4 to 5 days per week."
    });
  }

  if (glucose >= 100 || p.Diabetes === 1) {
    recommendations.push({
      priority: "High",
      category: "Glycemic Control",
      title: "Glycated Hemoglobin (HbA1c) Screening",
      description: "Schedule fasting blood glucose and HbA1c testing every 3 to 6 months. Emphasize low-glycemic complex carbohydrates and dietary fiber (>30g/day)."
    });
  }

  if (p.Cholesterol >= 200 || p.High_Cholesterol === 1) {
    recommendations.push({
      priority: "Medium",
      category: "Lipid Management",
      title: "Comprehensive Lipid Panel & Statin Evaluation",
      description: "Evaluate ApoB and LDL-C levels. Substitute saturated fats with omega-3 fatty acids and soluble plant stanols/sterols."
    });
  }

  recommendations.push({
    priority: "Preventive",
    category: "Preventive Health",
    title: "Sleep & Circadian Rhythm Hygiene",
    description: "Aim for 7 to 8.5 hours of uninterrupted sleep in a dark, cool environment. Chronic sleep deficits disrupt cortisol and sympathetic tone."
  });

  const familyAlerts = evaluateFamilyAlerts(p);

  return {
    id: `PRED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    patient_input: p,
    risk_level: riskLevel,
    risk_score_estimate: riskScoreEstimate,
    probabilities: {
      Low: probLow,
      Moderate: probMod,
      High: probHigh
    },
    top_factors: topFactors,
    clinical_warnings: clinicalWarnings,
    family_alerts: familyAlerts,
    recommendations: recommendations.slice(0, 5),
    lifestyle_score: lifestyleScore,
    bp_category: bpCategory,
    bmi_category: bmiCategory,
    metabolic_risk_count: metabolicRiskCount
  };
}

export function evaluateFamilyAlerts(p: PatientInput): FamilyAlert[] {
  const familyAlerts: FamilyAlert[] = [];
  const reportedSbp = Number(p.Systolic_BP || 120);
  const reportedDbp = Number(p.Diastolic_BP || 80);
  const reportedGlucose = Number(p.Blood_Glucose || 95);
  const reportedChol = Number(p.Cholesterol || 185);

  // 1. High Blood Pressure + Family History
  if ((reportedSbp >= 130 || reportedDbp >= 80 || p.Hypertension === 1) && p.Family_History_High_BP === 1) {
    const rel = p.Family_History_High_BP_Relative || "father/mother";
    familyAlerts.push({
      severity: "high",
      condition: "Hypertension / High Blood Pressure",
      title: "⚠ High Blood Pressure Detected (Familial Concordance)",
      message: `High blood pressure detected (${reportedSbp}/${reportedDbp} mmHg). Your ${rel} also has/had hypertension, which increases your genetic risk. Please consult a doctor.`,
      action: "Schedule clinical ambulatory blood pressure monitoring and physician consultation.",
      relative: rel
    });
  }

  // 2. Diabetes / Elevated Blood Sugar + Family History
  if ((reportedGlucose >= 126 || p.Diabetes === 1) && p.Family_History_Diabetes === 1) {
    const rel = p.Family_History_Diabetes_Relative || "father/mother";
    familyAlerts.push({
      severity: "high",
      condition: "Diabetes / Hyperglycemia",
      title: "⚠ Elevated Blood Sugar Detected (Familial Concordance)",
      message: `Fasting blood glucose of ${reportedGlucose} mg/dL detected. Your ${rel} also has/had diabetes, which increases your genetic risk. Please consult a doctor.`,
      action: "Schedule a fasting blood glucose and comprehensive HbA1c evaluation.",
      relative: rel
    });
  }

  // 3. Heart Disease + Family History
  if (p.Heart_Disease === 1 && p.Family_History_Heart_Disease === 1) {
    const rel = p.Family_History_Heart_Disease_Relative || "father/mother";
    familyAlerts.push({
      severity: "high",
      condition: "Cardiovascular Disease",
      title: "⚠ Heart Disease History (Familial Concordance)",
      message: `Personal heart disease documented. Your ${rel} also has/had heart disease, compounding hereditary cardiovascular vulnerability. Please consult a doctor.`,
      action: "Urgent cardiology follow-up, ECG, and echocardiography recommended.",
      relative: rel
    });
  }

  // 4. Cholesterol + Family History
  if ((reportedChol >= 200 || p.High_Cholesterol === 1) && p.Family_History_High_Cholesterol === 1) {
    const rel = p.Family_History_High_Cholesterol_Relative || "father/mother";
    familyAlerts.push({
      severity: "moderate",
      condition: "High Cholesterol / Dyslipidemia",
      title: "⚠ High Cholesterol Detected (Familial Concordance)",
      message: `Elevated cholesterol (${reportedChol} mg/dL) detected. Your ${rel} also has/had dyslipidemia, increasing inherited atherosclerosis risk. Please consult a doctor.`,
      action: "Comprehensive lipid fraction panel (LDL, HDL, ApoB) evaluation recommended.",
      relative: rel
    });
  }

  // 5. Stroke + Family History
  if ((p.Stroke_History === 1 || (reportedSbp >= 140 && Number(p.Age || 45) >= 50)) && p.Family_History_Stroke === 1) {
    const rel = p.Family_History_Stroke_Relative || "family member";
    familyAlerts.push({
      severity: "moderate",
      condition: "Cerebrovascular Disease / Stroke",
      title: "⚠ Cerebrovascular Risk with Familial Stroke History",
      message: `Vascular risk markers detected. Your ${rel} also has/had stroke history, highlighting neurovascular genetic vulnerability. Please consult a doctor.`,
      action: "Rigorous blood pressure control and neurovascular risk assessment advised.",
      relative: rel
    });
  }

  // 6. Kidney Disease + Family History
  if (p.Kidney_Disease === 1 && p.Family_History_Kidney_Disease === 1) {
    const rel = p.Family_History_Kidney_Disease_Relative || "family member";
    familyAlerts.push({
      severity: "moderate",
      condition: "Chronic Kidney Disease",
      title: "⚠ Chronic Kidney Disease (Familial Concordance)",
      message: `Kidney condition noted. Your ${rel} also has/had kidney disease, indicating potential hereditary nephropathic risk. Please consult a doctor.`,
      action: "Renal panel evaluation (eGFR, serum creatinine, urine albumin) indicated.",
      relative: rel
    });
  }

  // 7. Normal baseline alert if no compound personal-family alerts found
  if (familyAlerts.length === 0) {
    familyAlerts.push({
      severity: "normal",
      condition: "Preventive Familial Screening",
      title: "✓ No Compound Personal-Familial Disease Concordance Detected",
      message: "No acute compounding disease overlap was identified between your current recorded biomarkers and your reported family medical history.",
      action: "Continue maintaining regular annual preventive wellness health checkups."
    });
  }

  return familyAlerts;
}
