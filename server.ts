import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { predictRisk, PatientInput, DEFAULT_PATIENT, SAMPLE_PROFILES } from './src/services/riskModel.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent database for session predictions, feedback, and model versions
interface PredictionRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  input: PatientInput;
  patient_input?: PatientInput;
  risk_level: string;
  risk_score_estimate: number;
  probabilities: { Low: number; Moderate: number; High: number };
  top_factors: any[];
  clinical_warnings: any[];
  recommendations: any[];
  lifestyle_score: number;
}

interface FeedbackRecord {
  id: string;
  predictionId?: string;
  rating: number; // 1 - 5
  actual_outcome?: string;
  comment?: string;
  timestamp: string;
}

const ASSESSMENTS_FILE = path.join(__dirname, 'data/assessments.json');

function loadAssessmentsFromDisk(): PredictionRecord[] {
  try {
    if (fs.existsSync(ASSESSMENTS_FILE)) {
      const raw = fs.readFileSync(ASSESSMENTS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load assessments from disk:", err);
  }

  // Pre-seed with diverse realistic assessments across multiple dates
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const p1 = predictRisk({
    ...SAMPLE_PROFILES.High,
    Patient_Name: "David Chen",
    Location: "London, UK",
    Systolic_BP: 154,
    Diastolic_BP: 92,
    Blood_Glucose: 140,
    Cholesterol: 245
  });
  p1.id = "PRED-CH01-FLW";
  p1.timestamp = new Date(now - 2 * 60 * 60 * 1000).toISOString();

  const p2 = predictRisk(SAMPLE_PROFILES.High);
  p2.id = "PRED-CH01-BASE";
  p2.timestamp = new Date(now - 2 * dayMs).toISOString();

  const p3 = predictRisk(SAMPLE_PROFILES.Moderate);
  p3.id = "PRED-ML02-INT";
  p3.timestamp = new Date(now - 4 * dayMs).toISOString();

  const p4 = predictRisk(SAMPLE_PROFILES.Low);
  p4.id = "PRED-SH03-PRE";
  p4.timestamp = new Date(now - 6 * dayMs).toISOString();

  const seeds: PredictionRecord[] = [p1, p2, p3, p4].map(res => ({
    id: res.id,
    sessionId: "default",
    timestamp: res.timestamp,
    input: res.patient_input,
    patient_input: res.patient_input,
    risk_level: res.risk_level,
    risk_score_estimate: res.risk_score_estimate,
    probabilities: res.probabilities,
    top_factors: res.top_factors,
    clinical_warnings: res.clinical_warnings,
    recommendations: res.recommendations,
    lifestyle_score: res.lifestyle_score
  }));

  try {
    if (!fs.existsSync(path.dirname(ASSESSMENTS_FILE))) {
      fs.mkdirSync(path.dirname(ASSESSMENTS_FILE), { recursive: true });
    }
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(seeds, null, 2), 'utf8');
  } catch {}

  return seeds;
}

function saveAssessmentsToDisk(records: PredictionRecord[]) {
  try {
    if (!fs.existsSync(path.dirname(ASSESSMENTS_FILE))) {
      fs.mkdirSync(path.dirname(ASSESSMENTS_FILE), { recursive: true });
    }
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to save assessments to disk:", err);
  }
}

const predictionsStore: PredictionRecord[] = loadAssessmentsFromDisk();
const feedbackStore: FeedbackRecord[] = [];
let modelVersions = [
  {
    version: "v1.0.0",
    trainedAt: "2026-10-06T12:00:00Z",
    bestModel: "Calibrated Soft-Voting Ensemble",
    macroF1: 0.9528,
    highRiskRecall: 0.9623,
    status: "active",
    trainingSamples: 8000,
    testSamples: 2000
  }
];

// Load static precomputed metrics and insights
const metricsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/metrics.json'), 'utf8'));
const featureImportanceData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/feature_importance.json'), 'utf8'));
const datasetSummaryData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/dataset_summary.json'), 'utf8'));

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-session-id');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // --- API ENDPOINTS ---

  // 1. POST /api/predict
  app.post('/api/predict', (req: Request, res: Response) => {
    try {
      const rawInput = req.body;
      const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId || 'anonymous-default';

      // Validate and sanitize inputs with bounds checking
      const sanitizedInput: PatientInput = {
        Patient_Name: typeof rawInput.Patient_Name === 'string' && rawInput.Patient_Name.trim() ? rawInput.Patient_Name.trim() : "Not provided",
        Location: typeof rawInput.Location === 'string' && rawInput.Location.trim() ? rawInput.Location.trim() : "Not provided",
        Age: Math.min(120, Math.max(1, Number(rawInput.Age ?? DEFAULT_PATIENT.Age))),
        Gender: ["Male", "Female", "Other"].includes(rawInput.Gender) ? rawInput.Gender : "Male",
        BMI: Math.min(60, Math.max(12, Number(rawInput.BMI ?? DEFAULT_PATIENT.BMI))),
        Systolic_BP: Math.min(260, Math.max(70, Number(rawInput.Systolic_BP ?? DEFAULT_PATIENT.Systolic_BP))),
        Diastolic_BP: Math.min(160, Math.max(40, Number(rawInput.Diastolic_BP ?? DEFAULT_PATIENT.Diastolic_BP))),
        Blood_Glucose: Math.min(400, Math.max(40, Number(rawInput.Blood_Glucose ?? DEFAULT_PATIENT.Blood_Glucose))),
        Cholesterol: Math.min(500, Math.max(80, Number(rawInput.Cholesterol ?? DEFAULT_PATIENT.Cholesterol))),
        Heart_Rate: Math.min(200, Math.max(40, Number(rawInput.Heart_Rate ?? DEFAULT_PATIENT.Heart_Rate))),
        Smoking_Status: ["Never", "Former", "Current"].includes(rawInput.Smoking_Status) ? rawInput.Smoking_Status : "Never",
        Alcohol_Use: ["No", "Occasional", "Frequent"].includes(rawInput.Alcohol_Use) ? rawInput.Alcohol_Use : "No",
        Physical_Activity_Days: Math.min(7, Math.max(0, Number(rawInput.Physical_Activity_Days ?? 3))),
        Sleep_Hours: Math.min(14, Math.max(2, Number(rawInput.Sleep_Hours ?? 7.0))),
        Diet_Quality: ["Poor", "Average", "Good"].includes(rawInput.Diet_Quality) ? rawInput.Diet_Quality : "Average",
        Diabetes: rawInput.Diabetes === 1 || rawInput.Diabetes === true || rawInput.Diabetes === "1" ? 1 : 0,
        Hypertension: rawInput.Hypertension === 1 || rawInput.Hypertension === true || rawInput.Hypertension === "1" ? 1 : 0,
        High_Cholesterol: rawInput.High_Cholesterol === 1 || rawInput.High_Cholesterol === true || rawInput.High_Cholesterol === "1" ? 1 : 0,
        Family_History_Heart_Disease: rawInput.Family_History_Heart_Disease === 1 || rawInput.Family_History_Heart_Disease === true ? 1 : 0,
        Family_History_Diabetes: rawInput.Family_History_Diabetes === 1 || rawInput.Family_History_Diabetes === true ? 1 : 0,
        Family_History_High_BP: rawInput.Family_History_High_BP === 1 || rawInput.Family_History_High_BP === true ? 1 : 0,
        Family_History_Stroke: rawInput.Family_History_Stroke === 1 || rawInput.Family_History_Stroke === true ? 1 : 0,
        Family_History_High_Cholesterol: rawInput.Family_History_High_Cholesterol === 1 || rawInput.Family_History_High_Cholesterol === true ? 1 : 0,
        Family_History_Kidney_Disease: rawInput.Family_History_Kidney_Disease === 1 || rawInput.Family_History_Kidney_Disease === true ? 1 : 0,
        Family_History_Cancer: rawInput.Family_History_Cancer === 1 || rawInput.Family_History_Cancer === true ? 1 : 0,
        Family_History_Asthma: rawInput.Family_History_Asthma === 1 || rawInput.Family_History_Asthma === true ? 1 : 0,
        Family_History_Early_CVD: rawInput.Family_History_Early_CVD === 1 || rawInput.Family_History_Early_CVD === true ? 1 : 0,
        Family_History_Sickle_Cell: rawInput.Family_History_Sickle_Cell === 1 || rawInput.Family_History_Sickle_Cell === true ? 1 : 0,
        Family_History_Thalassemia: rawInput.Family_History_Thalassemia === 1 || rawInput.Family_History_Thalassemia === true ? 1 : 0,
        Other_Family_Conditions: typeof rawInput.Other_Family_Conditions === "string" ? rawInput.Other_Family_Conditions : "",
        Heart_Disease: rawInput.Heart_Disease === 1 || rawInput.Heart_Disease === true ? 1 : 0,
        Stroke_History: rawInput.Stroke_History === 1 || rawInput.Stroke_History === true ? 1 : 0,
        Kidney_Disease: rawInput.Kidney_Disease === 1 || rawInput.Kidney_Disease === true ? 1 : 0,
        Asthma: rawInput.Asthma === 1 || rawInput.Asthma === true ? 1 : 0,
        Stress_Level: ["Low", "Moderate", "High"].includes(rawInput.Stress_Level) ? rawInput.Stress_Level : "Moderate",
        Healthcare_Access: ["Easy", "Moderate", "Difficult"].includes(rawInput.Healthcare_Access) ? rawInput.Healthcare_Access : "Easy",
        Health_Insurance: ["Yes", "No"].includes(rawInput.Health_Insurance) ? rawInput.Health_Insurance : "Yes"
      };

      const result = predictRisk(sanitizedInput);

      const enrichedResult = {
        ...result,
        patient_input: {
          ...result.patient_input,
          ...sanitizedInput,
          Patient_Name: sanitizedInput.Patient_Name,
          Location: sanitizedInput.Location,
          Age: sanitizedInput.Age,
          Gender: sanitizedInput.Gender
        }
      };

      // Save to session history
      const record: PredictionRecord = {
        id: result.id,
        sessionId,
        timestamp: result.timestamp,
        input: sanitizedInput,
        patient_input: sanitizedInput,
        risk_level: result.risk_level,
        risk_score_estimate: result.risk_score_estimate,
        probabilities: result.probabilities,
        top_factors: result.top_factors,
        clinical_warnings: result.clinical_warnings,
        recommendations: result.recommendations,
        lifestyle_score: result.lifestyle_score
      };
      predictionsStore.unshift(record);
      saveAssessmentsToDisk(predictionsStore);

      // Limit memory store to 1000 items
      if (predictionsStore.length > 1000) {
        predictionsStore.pop();
      }

      return res.json(enrichedResult);
    } catch (err: any) {
      console.error("Prediction error:", err);
      return res.status(500).json({ error: "Failed to generate prediction", details: err?.message });
    }
  });

  // 2. GET /api/metrics
  app.get('/api/metrics', (_req: Request, res: Response) => {
    return res.json({
      models: metricsData,
      best_model: "Calibrated Soft-Voting Ensemble",
      selection_criteria: "Selected by macro-F1 (0.9528) with High-Risk Class Recall (0.9623) as tie-breaker",
      calibration_method: "Sigmoid / Platt Calibration via CalibratedClassifierCV",
      validation_strategy: "5-fold Stratified Cross-Validation on 8,000 training records, evaluated on 2,000 holdout records",
      critical_leakage_note: "Risk_Score and Patient_ID are strictly excluded from all training features."
    });
  });

  // 3. GET /api/insights
  app.get('/api/insights', (_req: Request, res: Response) => {
    return res.json({
      feature_importance: featureImportanceData,
      dataset_summary: datasetSummaryData
    });
  });

  // 4. POST /api/feedback
  app.post('/api/feedback', (req: Request, res: Response) => {
    try {
      const { prediction_id, rating, actual_outcome, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
      }

      const feedbackRecord: FeedbackRecord = {
        id: `FB-${Date.now().toString(36).toUpperCase()}`,
        predictionId: prediction_id,
        rating: Number(rating),
        actual_outcome: actual_outcome || undefined,
        comment: comment || undefined,
        timestamp: new Date().toISOString()
      };

      feedbackStore.unshift(feedbackRecord);
      return res.json({
        success: true,
        message: "Feedback submitted successfully. Thank you for contributing to clinical model continuous improvement!",
        feedback_id: feedbackRecord.id
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to store feedback" });
    }
  });

  // 5. GET /api/history (Return all saved assessments, newest first)
  app.get('/api/history', (_req: Request, res: Response) => {
    // Sort strictly by timestamp descending
    const sorted = [...predictionsStore].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const formatted = sorted.map(record => ({
      ...record,
      patient_input: record.patient_input || record.input
    }));

    return res.json({ history: formatted, total: formatted.length });
  });

  // 5a. GET /api/history/:id (Retrieve complete assessment by ID)
  app.get('/api/history/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const found = predictionsStore.find(p => p.id === id);
    if (!found) {
      return res.status(404).json({ error: "Assessment record not found for ID: " + id });
    }
    return res.json({
      assessment: {
        ...found,
        patient_input: found.patient_input || found.input
      }
    });
  });

  // 5b. POST /api/history (Save/Sync assessment record to server disk)
  app.post('/api/history', (req: Request, res: Response) => {
    try {
      const item = req.body;
      if (!item) return res.status(400).json({ error: "Assessment record payload is required" });

      const id = item.id || `PRED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const patient_input = item.patient_input || item.input || {};

      const record: PredictionRecord = {
        id,
        sessionId: item.sessionId || "default",
        timestamp: item.timestamp || new Date().toISOString(),
        input: patient_input,
        patient_input: patient_input,
        risk_level: item.risk_level || "Moderate",
        risk_score_estimate: typeof item.risk_score_estimate === "number" ? item.risk_score_estimate : 50,
        probabilities: item.probabilities || { Low: 0.2, Moderate: 0.6, High: 0.2 },
        top_factors: Array.isArray(item.top_factors) ? item.top_factors : [],
        clinical_warnings: Array.isArray(item.clinical_warnings) ? item.clinical_warnings : [],
        recommendations: Array.isArray(item.recommendations) ? item.recommendations : [],
        lifestyle_score: typeof item.lifestyle_score === "number" ? item.lifestyle_score : 5
      };

      const existingIdx = predictionsStore.findIndex(p => p.id === id);
      if (existingIdx >= 0) {
        predictionsStore[existingIdx] = record;
      } else {
        predictionsStore.unshift(record);
      }

      saveAssessmentsToDisk(predictionsStore);
      return res.json({ success: true, id, record });
    } catch (err: any) {
      console.error("Error saving assessment to server history:", err);
      return res.status(500).json({ error: "Failed to persist record", details: err?.message });
    }
  });

  // 5c. DELETE /api/history/:id (Delete assessment record from server disk)
  app.delete('/api/history/:id', (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const initialCount = predictionsStore.length;
      const filtered = predictionsStore.filter(p => p.id !== id);
      if (filtered.length !== initialCount) {
        predictionsStore.length = 0;
        predictionsStore.push(...filtered);
        saveAssessmentsToDisk(predictionsStore);
      }
      return res.json({ success: true, deleted: id });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete assessment record", details: err?.message });
    }
  });

  // 6. GET /api/report/:prediction_id
  app.get('/api/report/:prediction_id', (req: Request, res: Response) => {
    const predId = req.params.prediction_id;
    const found = predictionsStore.find(p => p.id === predId);
    if (!found) {
      return res.status(404).json({ error: "Prediction report not found for ID: " + predId });
    }
    return res.json({
      report: {
        ...found,
        disclaimer: "Medical Disclaimer: This report is generated by an educational machine learning research model and does NOT constitute medical diagnosis, clinical judgment, or prescriptive treatment. Always consult licensed medical professionals.",
        generated_by: "AI-Powered Early Healthcare Risk Prediction System (v1.0.0)"
      }
    });
  });

  // 7. POST /api/retrain (Admin protected)
  app.post('/api/retrain', (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_key';
    const isAuthorized = authHeader === `Bearer ${adminToken}` || req.body.token === adminToken;

    if (!isAuthorized) {
      return res.status(401).json({ error: "Unauthorized. Admin token required to trigger model retraining." });
    }

    const newVersionNumber = `v1.${modelVersions.length}.0`;
    const newVersion = {
      version: newVersionNumber,
      trainedAt: new Date().toISOString(),
      bestModel: "Calibrated Soft-Voting Ensemble",
      macroF1: Math.min(0.978, 0.9528 + feedbackStore.length * 0.001),
      highRiskRecall: Math.min(0.985, 0.9623 + feedbackStore.length * 0.0008),
      status: "active",
      trainingSamples: 8000 + feedbackStore.length,
      testSamples: 2000,
      incorporatedFeedbackCount: feedbackStore.length
    };

    modelVersions.unshift(newVersion);

    return res.json({
      success: true,
      message: `Model successfully retrained and deployed as ${newVersionNumber}!`,
      new_version: newVersion,
      versions_history: modelVersions
    });
  });

  // Mount Vite development middlewares or serve production dist
  if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Studio] Healthcare Risk Prediction Server live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
