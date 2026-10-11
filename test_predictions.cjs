// Test predictions for Low, Moderate, and High sample patients
const { predictRisk, SAMPLE_PROFILES } = require('./dist-test/riskModel.js');

console.log("=== TESTING PREDICTIONS FOR LOW, MODERATE, AND HIGH PROFILES ===");

["Low", "Moderate", "High"].forEach(level => {
  const input = SAMPLE_PROFILES[level];
  const result = predictRisk(input);
  console.log(`\n------------------ [TEST CASE: ${level.toUpperCase()} PROFILE] ------------------`);
  console.log(`Input: Age=${input.Age}, SBP=${input.Systolic_BP}, DBP=${input.Diastolic_BP}, Glucose=${input.Blood_Glucose}, BMI=${input.BMI}`);
  console.log(`Predicted Risk Level: ${result.risk_level}`);
  console.log(`Risk Score Gauge (0-100): ${result.risk_score_estimate}`);
  console.log(`Probabilities: Low=${result.probabilities.Low}, Moderate=${result.probabilities.Moderate}, High=${result.probabilities.High}`);
  console.log(`Top Factors (SHAP waterfall):`);
  result.top_factors.forEach(f => {
    console.log(`  - ${f.label} (${f.value}): ${f.impact > 0 ? '+' : ''}${f.impact}% [${f.direction}]`);
  });
  if (result.clinical_warnings.length > 0) {
    console.log(`Clinical Warnings:`);
    result.clinical_warnings.forEach(w => console.log(`  ! [${w.level.toUpperCase()}] ${w.title}`));
  }
});
console.log("\n=== ALL TEST PREDICTIONS COMPLETED SUCCESSFULLY ===");
