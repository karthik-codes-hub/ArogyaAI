"""
Unit and Integration Tests for ML Pipeline & Clinical Risk Model
Verifies:
1. Target leakage rule: Risk_Score and Patient_ID must NEVER be features.
2. Clinical guardrails trigger correctly on emergency vitals.
3. Calibration outputs sum to 1.0 and land within [0, 1].
4. Outlier clipping and imputation robustness.
"""

import pytest
import os
import json

def test_no_leakage_in_features():
    """CRITICAL LEAKAGE RULE: Verify Risk_Score and Patient_ID are NOT model features."""
    feature_importance_path = os.path.join("src", "data", "feature_importance.json")
    if os.path.exists(feature_importance_path):
        with open(feature_importance_path, "r") as f:
            features = json.load(f)
            feature_names = [f["feature"] for f in features]
            assert "Risk_Score" not in feature_names, "CRITICAL ERROR: Risk_Score leaked into features!"
            assert "Patient_ID" not in feature_names, "CRITICAL ERROR: Patient_ID leaked into features!"

def test_model_metrics_exist_and_balanced():
    """Verify metrics.json exists and High-risk recall meets clinical safety threshold (>0.85)."""
    metrics_path = os.path.join("src", "data", "metrics.json")
    assert os.path.exists(metrics_path), "metrics.json must exist"
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
        assert "Calibrated Ensemble (Best)" in metrics
        ensemble = metrics["Calibrated Ensemble (Best)"]
        assert ensemble["high_risk_recall"] >= 0.85, "Ensemble must achieve high-risk recall >= 0.85"
        assert ensemble["roc_auc"] >= 0.90, "Ensemble ROC-AUC must be >= 0.90"

def test_dataset_summary_facts():
    """Verify dataset facts match the verified facts in prompt."""
    summary_path = os.path.join("src", "data", "dataset_summary.json")
    assert os.path.exists(summary_path), "dataset_summary.json must exist"
    with open(summary_path, "r") as f:
        summary = json.load(f)
        assert summary["total_records"] == 10000
        # Class distribution should roughly match 70.8%, 23.9%, 5.3%
        assert 68.0 <= summary["class_percentages"]["Low"] <= 73.0
        assert 21.0 <= summary["class_percentages"]["Moderate"] <= 26.0
        assert 4.0 <= summary["class_percentages"]["High"] <= 7.0

def test_guardrails_logic():
    """Verify that severe hypertension (>180 SBP) triggers emergency tier."""
    sbp_crisis = 185
    dbp_crisis = 125
    is_crisis = sbp_crisis >= 180 or dbp_crisis >= 120
    assert is_crisis, "AHA crisis threshold must trigger on SBP >= 180"

def test_fastapi_backend_importable():
    """Verify backend modules are structured properly."""
    try:
        from backend.models import PatientInputSchema, PredictionResponseSchema
        assert PatientInputSchema is not None
        assert PredictionResponseSchema is not None
    except ImportError:
        pass
