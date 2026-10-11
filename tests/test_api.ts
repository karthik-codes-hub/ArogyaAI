/**
 * Integration Test for Risk Engine & Presets
 */
import { predictRisk, SAMPLE_PROFILES } from "../src/services/riskModel.ts";

function runTests() {
  console.log("Running Clinical Model Unit Tests...");

  // 1. Low Risk Test
  const lowResult = predictRisk(SAMPLE_PROFILES.Low);
  if (lowResult.risk_level !== "Low") {
    throw new Error(`Expected Low risk, received ${lowResult.risk_level}`);
  }
  if (lowResult.risk_score_estimate >= 35) {
    throw new Error(`Expected score < 35, received ${lowResult.risk_score_estimate}`);
  }
  console.log("✓ Low Risk Profile Passed (Score: " + lowResult.risk_score_estimate + ")");

  // 2. Moderate Risk Test
  const modResult = predictRisk(SAMPLE_PROFILES.Moderate);
  if (modResult.risk_level !== "Moderate") {
    throw new Error(`Expected Moderate risk, received ${modResult.risk_level}`);
  }
  if (modResult.risk_score_estimate < 35 || modResult.risk_score_estimate >= 65) {
    throw new Error(`Expected score in [35, 65), received ${modResult.risk_score_estimate}`);
  }
  console.log("✓ Moderate Risk Profile Passed (Score: " + modResult.risk_score_estimate + ")");

  // 3. High Risk Test
  const highResult = predictRisk(SAMPLE_PROFILES.High);
  if (highResult.risk_level !== "High") {
    throw new Error(`Expected High risk, received ${highResult.risk_level}`);
  }
  if (highResult.risk_score_estimate < 65) {
    throw new Error(`Expected score >= 65, received ${highResult.risk_score_estimate}`);
  }
  console.log("✓ High Risk Profile Passed (Score: " + highResult.risk_score_estimate + ")");

  // 4. Clinical Crisis Guardrail Test
  const crisisProfile = { ...SAMPLE_PROFILES.Low, Systolic_BP: 195, Diastolic_BP: 125 };
  const crisisResult = predictRisk(crisisProfile);
  if (!crisisResult.clinical_warnings.some((w) => w.level === "emergency")) {
    throw new Error("Expected emergency guardrail warning for SBP 195");
  }
  console.log("✓ Hypertensive Crisis Guardrail Override Passed");

  // 5. Probability Sums to 1.0 Test
  const pSum = Number((lowResult.probabilities.Low + lowResult.probabilities.Moderate + lowResult.probabilities.High).toFixed(2));
  if (Math.abs(pSum - 1.0) > 0.02) {
    throw new Error(`Probabilities must sum to 1.0, got ${pSum}`);
  }
  console.log("✓ Calibrated Probability Normalization Passed");

  console.log("ALL CLINICAL ENGINE TESTS PASSED SUCCESSFULLY!");
}

runTests();
