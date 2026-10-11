import { jsPDF } from "jspdf";
import { PredictionResult, ShapFactor, PatientInput } from "../services/riskModel.ts";

export function generatePatientPDFReport(result: PredictionResult): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Safe parsing of input
  let rawP: any = result.patient_input || (result as any).input || (result as any).patient || {};
  if (typeof rawP === "string") {
    try {
      rawP = JSON.parse(rawP);
    } catch {
      rawP = {};
    }
  }
  const p = rawP;

  // Extract Patient Name across all common representations
  const rawName = p.Patient_Name || p.patient_name || p.patientName || p.name || p.fullName || (result as any).Patient_Name || (result as any).patient_name || (result as any).name;
  const patientName = rawName && String(rawName).trim() && String(rawName).trim() !== "Not provided" 
    ? String(rawName).trim() 
    : "Not provided";

  // Extract Age across all common representations
  const rawAge = p.Age !== undefined && p.Age !== null && p.Age !== "" 
    ? p.Age 
    : p.age !== undefined && p.age !== null && p.age !== "" 
    ? p.age 
    : (result as any).Age !== undefined 
    ? (result as any).Age 
    : (result as any).age;
  const patientAge = rawAge !== undefined && rawAge !== null && rawAge !== "" && !isNaN(Number(rawAge)) ? `${Number(rawAge)} years` : "Not provided";

  // Extract Gender
  const patientGender = p.Gender || p.gender || (result as any).Gender || (result as any).gender || "Not provided";

  // Extract Location
  const rawLocation = p.Location || p.location || (result as any).Location || (result as any).location;
  const patientLocation = rawLocation && String(rawLocation).trim() && String(rawLocation).trim() !== "Not provided" ? String(rawLocation).trim() : "Not provided";

  // Date and Time
  const dateObj = result.timestamp ? new Date(result.timestamp) : new Date();
  const assessmentDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const assessmentTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Palette
  const navy = [11, 37, 69]; // #0B2545
  const teal = [13, 148, 136]; // #0D9488
  const emerald = [22, 163, 74]; // #16A34A
  const textDark = [30, 41, 59]; // slate-800
  const textMuted = [100, 116, 139]; // slate-500
  const lightBg = [248, 250, 252]; // slate-50
  const borderCol = [226, 232, 240]; // slate-200

  // 1. TOP HEADER BANNER (44mm height for spacious prominence)
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 44, "F");

  // Accent teal line
  doc.setFillColor(teal[0], teal[1], teal[2]);
  doc.rect(0, 44, 210, 2, "F");

  // Left Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("ArogyaAI", 14, 15);

  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Clinical Health Risk Prediction System", 14, 22);

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.text("Predict Early. Prevent Better. Live Healthier.", 14, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Assessment ID: ${result.id}   |   Date: ${assessmentDate} at ${assessmentTime}`, 14, 37);

  // Right Side Patient Profile Box in Header
  doc.setFillColor(23, 50, 85);
  doc.roundedRect(120, 8, 76, 29, 2.5, 2.5, "F");
  doc.setDrawColor(teal[0], teal[1], teal[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(120, 8, 76, 29, 2.5, 2.5, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153);
  doc.text("PATIENT RECORD SUMMARY", 124, 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  const truncatedName = patientName.length > 22 ? patientName.substring(0, 20) + "..." : patientName;
  doc.text(truncatedName, 124, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`Age: ${patientAge}  |  Gender: ${patientGender}`, 124, 26);
  doc.text(`Location: ${patientLocation.length > 22 ? patientLocation.substring(0, 20) + "..." : patientLocation}`, 124, 32);

  let curY = 52;

  // 2. ASSESSMENT OUTCOME SUMMARY BOX
  let riskColor = [22, 163, 74]; // Green for Low
  if (result.risk_level === "Moderate") riskColor = [217, 119, 6]; // Amber
  if (result.risk_level === "High") riskColor = [220, 38, 38]; // Red

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, curY, 182, 33, 3, 3, "F");
  doc.setDrawColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(14, curY, 182, 33, 3, 3, "S");

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("ESTIMATED CLINICAL RISK CLASSIFICATION", 20, curY + 6.5);

  doc.setFontSize(14.5);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`${result.risk_level.toUpperCase()} CARDIOMETABOLIC RISK`, 20, curY + 15);

  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`Risk Score Index: ${result.risk_score_estimate} / 100`, 20, curY + 22.5);
  doc.text(
    `Class Probabilities: Low ${(result.probabilities.Low * 100).toFixed(1)}%  |  Moderate ${(result.probabilities.Moderate * 100).toFixed(1)}%  |  High ${(result.probabilities.High * 100).toFixed(1)}%`,
    20,
    curY + 28
  );

  curY += 39;

  // Clinical Warnings (if any)
  if (result.clinical_warnings && result.clinical_warnings.length > 0) {
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(14, curY, 182, 14, 2, 2, "F");
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(`! CLINICAL GUARDRAIL ALERT: ${result.clinical_warnings[0].title}`, 18, curY + 5.5);
    doc.setFont("helvetica", "normal");
    doc.text(result.clinical_warnings[0].message, 18, curY + 10.5);
    curY += 18;
  }

  // Helper function to draw clean section header
  const drawSectionHeader = (title: string, yPos: number) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos, 182, 6.5, "F");
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(title, 18, yPos + 4.8);
    return yPos + 8;
  };

  // 3. SECTION 1: PATIENT DEMOGRAPHICS (Prominently displaying Patient Name and Age)
  curY = drawSectionHeader("1. Patient Demographics & Baseline Profile", curY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  doc.setFont("helvetica", "bold");
  doc.text("Patient Full Name:", 18, curY + 4);
  doc.setFont("helvetica", "normal");
  doc.text(patientName, 50, curY + 4);

  doc.setFont("helvetica", "bold");
  doc.text("Age:", 100, curY + 4);
  doc.setFont("helvetica", "normal");
  doc.text(patientAge, 112, curY + 4);

  doc.setFont("helvetica", "bold");
  doc.text("Gender:", 145, curY + 4);
  doc.setFont("helvetica", "normal");
  doc.text(patientGender, 160, curY + 4);

  doc.setFont("helvetica", "bold");
  doc.text("Location / City:", 18, curY + 9);
  doc.setFont("helvetica", "normal");
  doc.text(patientLocation, 50, curY + 9);

  doc.setFont("helvetica", "bold");
  doc.text("Healthcare Access:", 100, curY + 9);
  doc.setFont("helvetica", "normal");
  doc.text(p.Healthcare_Access || "Easy", 132, curY + 9);

  doc.setFont("helvetica", "bold");
  doc.text("Insurance:", 155, curY + 9);
  doc.setFont("helvetica", "normal");
  doc.text(p.Health_Insurance || "Yes", 172, curY + 9);

  curY += 15;

  // 4. SECTION 2: VITAL SIGNS & LABORATORY BIOMARKERS
  curY = drawSectionHeader("2. Vital Signs & Laboratory Biomarkers", curY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  doc.text(`Blood Pressure: ${p.Systolic_BP || "--"} / ${p.Diastolic_BP || "--"} mmHg`, 18, curY + 4);
  doc.text(`BP Category: ${result.bp_category?.label || "Normal"}`, 95, curY + 4);
  doc.text(`Heart Rate: ${p.Heart_Rate || "--"} bpm`, 150, curY + 4);

  doc.text(`BMI: ${p.BMI || "--"} kg/m² (${result.bmi_category?.label || "Normal"})`, 18, curY + 9);
  doc.text(`Fasting Glucose: ${p.Blood_Glucose || "--"} mg/dL`, 95, curY + 9);
  doc.text(`Total Cholesterol: ${p.Cholesterol || "--"} mg/dL`, 150, curY + 9);

  curY += 15;

  // 5. SECTION 3: HEREDITARY FAMILY MEDICAL HISTORY (First-Degree Relatives)
  curY = drawSectionHeader("3. Hereditary Family Medical History (First-Degree Relatives)", curY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  const familyItems: string[] = [];
  if (p.Family_History_Heart_Disease) familyItems.push(`Heart Disease (${p.Family_History_Heart_Disease_Relative || "First-Degree"})`);
  if (p.Family_History_Early_CVD) familyItems.push(`Early CAD <55y (${p.Family_History_Early_CVD_Relative || "Family"})`);
  if (p.Family_History_High_BP) familyItems.push(`Hypertension (${p.Family_History_High_BP_Relative || "First-Degree"})`);
  if (p.Family_History_Diabetes) familyItems.push(`Diabetes Mellitus (${p.Family_History_Diabetes_Relative || "First-Degree"})`);
  if (p.Family_History_Stroke) familyItems.push(`Stroke (${p.Family_History_Stroke_Relative || "First-Degree"})`);
  if (p.Family_History_High_Cholesterol) familyItems.push(`High Cholesterol (${p.Family_History_High_Cholesterol_Relative || "First-Degree"})`);
  if (p.Family_History_Kidney_Disease) familyItems.push(`Kidney Disease (${p.Family_History_Kidney_Disease_Relative || "First-Degree"})`);
  if (p.Family_History_Cancer) familyItems.push(`Cancer (${p.Family_History_Cancer_Relative || "Family"})`);
  if (p.Family_History_Asthma) familyItems.push(`Asthma/Pulmonary (${p.Family_History_Asthma_Relative || "Family"})`);
  if (p.Family_History_Sickle_Cell) familyItems.push(`Sickle Cell (${p.Family_History_Sickle_Cell_Relative || "Trait"})`);
  if (p.Family_History_Thalassemia) familyItems.push(`Thalassemia (${p.Family_History_Thalassemia_Relative || "Trait"})`);
  if (p.Other_Family_Conditions) familyItems.push(`Other: ${p.Other_Family_Conditions}`);

  if (familyItems.length === 0) {
    doc.text("No hereditary chronic medical conditions reported in first-degree relatives.", 18, curY + 4);
    curY += 10;
  } else {
    const chunk1 = familyItems.slice(0, 3).join("   •   ");
    doc.text(`Reported Conditions: ${chunk1}`, 18, curY + 4);
    if (familyItems.length > 3) {
      const chunk2 = familyItems.slice(3, 7).join("   •   ");
      doc.text(`                     ${chunk2}`, 18, curY + 9);
      if (familyItems.length > 7) {
        const chunk3 = familyItems.slice(7).join("   •   ");
        doc.text(`                     ${chunk3}`, 18, curY + 14);
        curY += 20;
      } else {
        curY += 15;
      }
    } else {
      curY += 10;
    }
  }

  // 6. SECTION 4: LIFESTYLE & BEHAVIORAL FACTORS
  curY = drawSectionHeader("4. Lifestyle Habits & Behavioral Indicators", curY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  doc.text(`Smoking Status: ${p.Smoking_Status || "Never"}`, 18, curY + 4);
  doc.text(`Alcohol Intake: ${p.Alcohol_Use || "No"}`, 85, curY + 4);
  doc.text(`Exercise: ${p.Physical_Activity_Days ?? 3} days/week`, 145, curY + 4);

  doc.text(`Sleep: ${p.Sleep_Hours ?? 7} hours/night`, 18, curY + 9);
  doc.text(`Diet Quality: ${p.Diet_Quality || "Average"}`, 85, curY + 9);
  doc.text(`Stress Level: ${p.Stress_Level || "Moderate"}`, 145, curY + 9);
  curY += 15;

  // Page break check before Key Factors and Recommendations
  if (curY > 215) {
    doc.addPage();
    curY = 20;
  }

  // 7. SECTION 5: KEY FACTOR DRIVERS
  curY = drawSectionHeader("5. Key Risk Contributing Factors (Explainable AI / SHAP)", curY);
  doc.setFontSize(8.5);

  if (result.top_factors && result.top_factors.length > 0) {
    result.top_factors.slice(0, 4).forEach((factor: ShapFactor, idx: number) => {
      const isUp = factor.direction === "raises risk";
      doc.setTextColor(isUp ? 185 : 22, isUp ? 28 : 101, isUp ? 28 : 52);
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${factor.label} [${factor.value}]`, 18, curY + 4);

      const impactStr = `${factor.impact > 0 ? "+" : ""}${factor.impact}% (${factor.direction.toUpperCase()})`;
      doc.text(impactStr, 140, curY + 4);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFontSize(7.5);
      doc.text(`Context: ${factor.clinicalContext}`, 22, curY + 8);
      doc.setFontSize(8.5);

      curY += 10.5;
    });
  } else {
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("All measured indicators within standard ranges.", 18, curY + 4);
    curY += 8;
  }

  curY += 2;

  // Page break check before Recommendations
  if (curY > 210) {
    doc.addPage();
    curY = 20;
  }

  // 8. SECTION 6: PERSONALIZED PREVENTIVE RECOMMENDATIONS
  curY = drawSectionHeader("6. Personalized Preventive Health Recommendations", curY);

  if (result.recommendations && result.recommendations.length > 0) {
    result.recommendations.slice(0, 3).forEach((rec: any) => {
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(`• [${rec.priority}] ${rec.title} (${rec.category})`, 18, curY + 4);

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const splitText = doc.splitTextToSize(rec.description, 174);
      doc.text(splitText, 22, curY + 8);
      curY += splitText.length * 3.8 + 5;
    });
  }

  // Footer Disclaimer
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 278, 196, 278);

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text(
    "IMPORTANT MEDICAL DISCLAIMER: ArogyaAI is an automated clinical risk-screening and health awareness tool.",
    14,
    283
  );
  doc.text(
    "Predictions are preliminary estimates and do NOT substitute for professional medical advice, diagnosis, or treatment. Consult a licensed healthcare professional.",
    14,
    287
  );

  const cleanName = patientName.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`ArogyaAI_Clinical_Report_${cleanName}_${result.id}.pdf`);
}
