const fs = require('fs');

console.log("Generating 10,000 patient AI_Healthcare_Risk_Dataset.csv...");

// Pseudorandom generator with seed 42
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const random = mulberry32(42);

function randRange(min, max) {
  return min + random() * (max - min);
}

function randInt(min, max) {
  return Math.floor(randRange(min, max + 1));
}

function normal(mean, std) {
  // Box-Muller transform
  const u1 = Math.max(1e-7, random());
  const u2 = random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

function pick(choices, weights) {
  const r = random();
  let acc = 0;
  for (let i = 0; i < choices.length; i++) {
    acc += weights[i];
    if (r <= acc) return choices[i];
  }
  return choices[choices.length - 1];
}

const N = 10000;
const rows = [];
const header = [
  "Patient_ID", "Age", "Gender", "BMI", "Systolic_BP", "Diastolic_BP",
  "Blood_Glucose", "Cholesterol", "Heart_Rate", "Smoking_Status", "Alcohol_Use",
  "Physical_Activity_Days", "Sleep_Hours", "Diet_Quality", "Diabetes", "Hypertension",
  "High_Cholesterol", "Family_History_Heart_Disease", "Heart_Disease", "Stroke_History",
  "Kidney_Disease", "Asthma", "Stress_Level", "Healthcare_Access", "Health_Insurance",
  "Risk_Score", "Risk_Level"
];

const gendersList = ["Male", "Female", "Other"];
const genderWeights = [0.49, 0.48, 0.03];

const smokingList = ["Never", "Former", "Current"];
const smokingWeights = [0.58, 0.24, 0.18];

const alcoholList = ["No", "Occasional", "Frequent"];
const alcoholWeights = [0.42, 0.43, 0.15];

const dietList = ["Poor", "Average", "Good"];
const dietWeights = [0.24, 0.51, 0.25];

const stressList = ["Low", "Moderate", "High"];
const stressWeights = [0.31, 0.49, 0.20];

const accessList = ["Easy", "Moderate", "Difficult"];
const accessWeights = [0.60, 0.28, 0.12];

const rawData = [];

for (let i = 1; i <= N; i++) {
  const patientId = `P${String(i).padStart(5, '0')}`;
  const age = randInt(18, 80);
  const gender = pick(gendersList, genderWeights);
  const bmi = Math.min(48.0, Math.max(15.0, normal(25.8 + (age - 18) * 0.04, 5.2)));
  const systolic = Math.round(Math.min(200, Math.max(85, normal(114 + (age - 18) * 0.45 + (bmi - 22) * 0.6, 16.0))));
  const diastolic = Math.round(Math.min(115, Math.max(50, normal(68 + (age - 18) * 0.2 + (bmi - 22) * 0.35, 10.0))));
  const glucose = Math.round(Math.min(200, Math.max(60, normal(92 + (age - 18) * 0.35 + (bmi - 22) * 0.5, 25.0))));
  const cholesterol = Math.round(Math.min(320, Math.max(100, normal(182 + (age - 18) * 0.45, 38.0))) * 10) / 10;
  const heartRate = Math.round(Math.min(110, Math.max(45, normal(74, 10.0))));

  const smoking = pick(smokingList, smokingWeights);
  const alcohol = pick(alcoholList, alcoholWeights);
  const physActivity = randInt(0, 7);
  const sleepHours = Math.round(Math.min(10.0, Math.max(3.5, normal(7.0 - (age - 18) * 0.01, 1.2))) * 10) / 10;
  const diet = pick(dietList, dietWeights);

  const pDiabetes = 1 / (1 + Math.exp(-(-4.0 + 0.035 * age + 0.06 * (bmi - 24) + 0.02 * (glucose - 100))));
  const diabetes = random() < pDiabetes ? 1 : 0;

  const pHtn = 1 / (1 + Math.exp(-(-4.2 + 0.04 * age + 0.05 * (systolic - 120))));
  const hypertension = random() < pHtn ? 1 : 0;

  const pHighChol = 1 / (1 + Math.exp(-(-3.8 + 0.025 * age + 0.025 * (cholesterol - 200))));
  const highChol = random() < pHighChol ? 1 : 0;

  const pFamHeart = Math.min(0.30, Math.max(0.15, 0.18 + 0.001 * age));
  const famHeart = random() < pFamHeart ? 1 : 0;

  const pHeartDis = 1 / (1 + Math.exp(-(-5.0 + 0.045 * age + 0.8 * hypertension + 0.7 * highChol)));
  const heartDisease = random() < pHeartDis ? 1 : 0;

  const pStroke = 1 / (1 + Math.exp(-(-5.5 + 0.04 * age + 1.0 * hypertension + 0.6 * heartDisease)));
  const strokeHistory = random() < pStroke ? 1 : 0;

  const pKidney = 1 / (1 + Math.exp(-(-5.5 + 0.035 * age + 0.8 * diabetes + 0.6 * hypertension)));
  const kidneyDisease = random() < pKidney ? 1 : 0;

  const asthma = random() < 0.08 ? 1 : 0;

  const stress = pick(stressList, stressWeights);
  const access = pick(accessList, accessWeights);
  const insurance = random() < 0.82 ? "Yes" : "No";

  // Calculate clinical risk score
  const smokingVal = smoking === "Current" ? 1.1 : (smoking === "Former" ? 0.4 : 0);
  const alcoholVal = alcohol === "Frequent" ? 0.7 : (alcohol === "Occasional" ? 0.2 : 0);
  const dietVal = diet === "Poor" ? 0.8 : (diet === "Average" ? 0.3 : 0);
  const stressVal = stress === "High" ? 0.6 : (stress === "Moderate" ? 0.2 : 0);
  const accessVal = access === "Difficult" ? 0.4 : (access === "Moderate" ? 0.15 : 0);
  const insVal = insurance === "No" ? 0.35 : 0;

  let rawScore = (
    0.025 * (age - 18) +
    0.07 * Math.max(0, bmi - 25) +
    0.035 * Math.max(0, systolic - 120) +
    0.02 * Math.max(0, diastolic - 80) +
    0.025 * Math.max(0, glucose - 100) +
    0.008 * Math.max(0, cholesterol - 200) +
    0.015 * Math.max(0, heartRate - 75) +
    smokingVal + alcoholVal +
    (7 - physActivity) * 0.08 +
    Math.max(0, 7.0 - sleepHours) * 0.2 +
    dietVal +
    1.6 * diabetes + 1.4 * hypertension + 1.1 * highChol + 0.8 * famHeart +
    1.8 * heartDisease + 1.9 * strokeHistory + 1.7 * kidneyDisease + 0.5 * asthma +
    stressVal + accessVal + insVal +
    normal(0, 0.4) - 1.2
  );

  rawData.push({
    patientId, age, gender, bmi: Math.round(bmi * 10) / 10, systolic, diastolic, glucose,
    cholesterol, heartRate, smoking, alcohol, physActivity, sleepHours, diet,
    diabetes, hypertension, highChol, famHeart, heartDisease, strokeHistory,
    kidneyDisease, asthma, stress, access, insurance, rawScore
  });
}

// Percentile stretch to match verified cutoff facts:
// Low: <3.5 (~70.8%), Moderate: 3.5-6.49 (~23.9%), High: >=6.5 (~5.3%)
const rawScoresSorted = rawData.map(d => d.rawScore).sort((a, b) => a - b);
const qLow = rawScoresSorted[Math.floor(0.708 * N)];
const qHigh = rawScoresSorted[Math.floor(0.947 * N)];
const a = 3.0 / (qHigh - qLow);
const b = 3.5 - a * qLow;

let countLow = 0, countMod = 0, countHigh = 0;
const finalData = rawData.map(d => {
  const riskScore = Math.round((a * d.rawScore + b) * 100) / 100;
  let riskLevel = "Low";
  if (riskScore >= 6.5) {
    riskLevel = "High";
    countHigh++;
  } else if (riskScore >= 3.5) {
    riskLevel = "Moderate";
    countMod++;
  } else {
    countLow++;
  }
  return { ...d, riskScore, riskLevel };
});

console.log(`Class distribution: Low=${(countLow / N * 100).toFixed(1)}%, Moderate=${(countMod / N * 100).toFixed(1)}%, High=${(countHigh / N * 100).toFixed(1)}%`);

// Add missing values: exactly 200 in BMI, Cholesterol, Sleep_Hours, Diet_Quality, Stress_Level
const missingCols = ["bmi", "cholesterol", "sleepHours", "diet", "stress"];
missingCols.forEach(col => {
  const chosenIndices = new Set();
  while (chosenIndices.size < 200) {
    chosenIndices.add(Math.floor(random() * N));
  }
  chosenIndices.forEach(idx => {
    finalData[idx][col] = "";
  });
});

const csvRows = [header.join(",")];
finalData.forEach(d => {
  csvRows.push([
    d.patientId, d.age, d.gender, d.bmi, d.systolic, d.diastolic, d.glucose,
    d.cholesterol, d.heartRate, d.smoking, d.alcohol, d.physActivity, d.sleepHours,
    d.diet, d.diabetes, d.hypertension, d.highChol, d.famHeart, d.heartDisease,
    d.strokeHistory, d.kidneyDisease, d.asthma, d.stress, d.access, d.insurance,
    d.riskScore, d.riskLevel
  ].join(","));
});

fs.writeFileSync("AI_Healthcare_Risk_Dataset.csv", csvRows.join("\n"));
console.log("Successfully generated AI_Healthcare_Risk_Dataset.csv with 10,000 rows!");
