import { PredictionResult, predictRisk, DEFAULT_PATIENT, SAMPLE_PROFILES, PatientInput } from "./riskModel.ts";

const STORAGE_KEY = "arogya_assessment_history_v1";

// Create initial realistic clinical seed records across different dates
function createSeedAssessments(): PredictionResult[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // 1. Follow-up evaluation for David Chen (Today)
  const davidFollowupInput: PatientInput = {
    ...SAMPLE_PROFILES.High,
    Patient_Name: "David Chen",
    Age: 68,
    Gender: "Male",
    Location: "London, UK",
    Systolic_BP: 154,
    Diastolic_BP: 92,
    Blood_Glucose: 140,
    Cholesterol: 245,
    Heart_Rate: 80,
    BMI: 33.8
  };
  const davidFollowup = predictRisk(davidFollowupInput);
  davidFollowup.id = "PRED-CH01-FLW";
  davidFollowup.timestamp = new Date(now - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago

  // 2. Baseline evaluation for David Chen (2 days ago)
  const davidBaseline = predictRisk(SAMPLE_PROFILES.High);
  davidBaseline.id = "PRED-CH01-BASE";
  davidBaseline.timestamp = new Date(now - 2 * dayMs).toISOString(); // 2 days ago

  // 3. Evaluation for Robert Miller (4 days ago)
  const robertAssessment = predictRisk(SAMPLE_PROFILES.Moderate);
  robertAssessment.id = "PRED-ML02-INT";
  robertAssessment.timestamp = new Date(now - 4 * dayMs).toISOString(); // 4 days ago

  // 4. Evaluation for Priya Sharma (6 days ago)
  const priyaAssessment = predictRisk(SAMPLE_PROFILES.Low);
  priyaAssessment.id = "PRED-SH03-PRE";
  priyaAssessment.timestamp = new Date(now - 6 * dayMs).toISOString(); // 6 days ago

  return [davidFollowup, davidBaseline, robertAssessment, priyaAssessment];
}

export const historyService = {
  // Get all saved assessments (most recent first)
  getAssessments(): PredictionResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Initialize with default diverse seed assessments if no history exists
        const seeds = createSeedAssessments();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
        } catch {
          // Ignore storage quota errors
        }
        return seeds;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const seeds = createSeedAssessments();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
        } catch {}
        return seeds;
      }

      // Ensure every record has full predictions and proper mapping
      const mapped = parsed.map((item: any) => {
        const patient_input = item.patient_input || item.input || {};
        const pName =
          patient_input.Patient_Name ||
          patient_input.patient_name ||
          patient_input.name ||
          item.Patient_Name ||
          item.name ||
          "Not provided";
        const pAge =
          patient_input.Age !== undefined
            ? patient_input.Age
            : patient_input.age !== undefined
            ? patient_input.age
            : item.Age !== undefined
            ? item.Age
            : item.age;
        const pGender =
          patient_input.Gender || patient_input.gender || item.Gender || item.gender || "Not provided";
        const pLoc =
          patient_input.Location || patient_input.location || item.Location || item.location || "Not provided";

        const mergedInput: PatientInput = {
          ...DEFAULT_PATIENT,
          ...patient_input,
          Patient_Name: pName,
          Age: pAge !== undefined ? Number(pAge) : 45,
          Gender: pGender,
          Location: pLoc
        };

        let fullResult: PredictionResult;
        if (item.probabilities && item.top_factors && item.risk_level && item.clinical_warnings) {
          fullResult = {
            ...item,
            id: item.id || `PRED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            timestamp: item.timestamp || new Date().toISOString(),
            patient_input: mergedInput
          };
        } else {
          fullResult = predictRisk(mergedInput);
          fullResult.id = item.id || fullResult.id;
          fullResult.timestamp = item.timestamp || fullResult.timestamp;
        }
        return fullResult;
      });

      // Sort strictly newest first by timestamp
      mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return mapped;
    } catch (err) {
      console.error("Error reading assessment history from localStorage:", err);
      return createSeedAssessments();
    }
  },

  // Get a single assessment by its unique ID
  getAssessmentById(id: string): PredictionResult | null {
    if (!id) return null;
    const all = this.getAssessments();
    const found = all.find((item) => item.id === id);
    return found || null;
  },

  // Save a new assessment record (prepends without overwriting other records)
  saveAssessment(result: PredictionResult): void {
    try {
      if (!result) return;
      if (!result.id) {
        result.id = `PRED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      }
      if (!result.timestamp) {
        result.timestamp = new Date().toISOString();
      }

      const existing = this.getAssessments();
      // Only replace if exact same ID already exists (idempotent update), otherwise append/prepend
      const index = existing.findIndex((item) => item.id === result.id);
      let updated: PredictionResult[];
      if (index >= 0) {
        updated = [...existing];
        updated[index] = result;
      } else {
        // Prepend new assessment record to the top
        updated = [result, ...existing];
      }

      // Sort newest first
      updated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Persist in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 150)));

      // Sync to server storage in background
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result)
      }).catch((err) => {
        console.warn("Async server history sync failed (ignorable in offline mode):", err);
      });
    } catch (err) {
      console.error("Error saving assessment to localStorage:", err);
    }
  },

  // Delete a single assessment record by ID
  deleteAssessment(id: string): void {
    try {
      const existing = this.getAssessments();
      const updated = existing.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Sync delete with server
      fetch(`/api/history/${encodeURIComponent(id)}`, {
        method: "DELETE"
      }).catch((err) => {
        console.warn("Server delete sync failed:", err);
      });
    } catch (err) {
      console.error("Error deleting assessment from localStorage:", err);
    }
  },

  // Clear all saved assessments
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Error clearing assessment history:", err);
    }
  }
};
