from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Literal

class PatientInputSchema(BaseModel):
    Age: int = Field(..., ge=18, le=110, description="Patient age in years (18-110)")
    Gender: Literal["Male", "Female", "Other"] = Field(..., description="Biological sex or gender category")
    BMI: float = Field(..., ge=12.0, le=60.0, description="Body Mass Index in kg/m^2")
    Systolic_BP: int = Field(..., ge=70, le=260, description="Systolic Blood Pressure in mmHg")
    Diastolic_BP: int = Field(..., ge=40, le=160, description="Diastolic Blood Pressure in mmHg")
    Blood_Glucose: int = Field(..., ge=40, le=400, description="Fasting Blood Glucose in mg/dL")
    Cholesterol: float = Field(..., ge=80.0, le=500.0, description="Serum Total Cholesterol in mg/dL")
    Heart_Rate: int = Field(..., ge=40, le=200, description="Resting Heart Rate in beats per minute")
    Smoking_Status: Literal["Never", "Former", "Current"] = Field(..., description="Tobacco smoking history")
    Alcohol_Use: Literal["No", "Occasional", "Frequent"] = Field(..., description="Alcohol consumption frequency")
    Physical_Activity_Days: int = Field(..., ge=0, le=7, description="Days per week of exercise (0-7)")
    Sleep_Hours: float = Field(..., ge=2.0, le=14.0, description="Average sleep per night in hours")
    Diet_Quality: Literal["Poor", "Average", "Good"] = Field(..., description="Dietary quality rating")
    Diabetes: int = Field(0, ge=0, le=1, description="Diabetes mellitus diagnosis (0 or 1)")
    Hypertension: int = Field(0, ge=0, le=1, description="Hypertension diagnosis (0 or 1)")
    High_Cholesterol: int = Field(0, ge=0, le=1, description="Hypercholesterolemia diagnosis (0 or 1)")
    Family_History_Heart_Disease: int = Field(0, ge=0, le=1, description="Family history of heart disease (0 or 1)")
    Heart_Disease: int = Field(0, ge=0, le=1, description="Documented ischemic heart disease (0 or 1)")
    Stroke_History: int = Field(0, ge=0, le=1, description="History of stroke or TIA (0 or 1)")
    Kidney_Disease: int = Field(0, ge=0, le=1, description="Chronic kidney disease diagnosis (0 or 1)")
    Asthma: int = Field(0, ge=0, le=1, description="Asthma or reactive airway disease (0 or 1)")
    Stress_Level: Literal["Low", "Moderate", "High"] = Field("Moderate", description="Self-reported stress level")
    Healthcare_Access: Literal["Easy", "Moderate", "Difficult"] = Field("Easy", description="Healthcare access difficulty")
    Health_Insurance: Literal["Yes", "No"] = Field("Yes", description="Health insurance coverage status")

class FactorSchema(BaseModel):
    feature: str
    label: str
    value: str
    impact: float
    direction: Literal["raises risk", "lowers risk"]
    category: str
    clinicalContext: str

class ClinicalWarningSchema(BaseModel):
    level: Literal["emergency", "warning", "advisory"]
    title: str
    message: str = ""
    action: str

class RecommendationSchema(BaseModel):
    priority: Literal["Urgent", "High", "Medium", "Preventive"]
    category: str
    title: str
    description: str

class PredictionResponseSchema(BaseModel):
    id: str
    timestamp: str
    risk_level: Literal["Low", "Moderate", "High"]
    risk_score_estimate: float
    probabilities: Dict[str, float]
    top_factors: List[FactorSchema]
    clinical_warnings: List[ClinicalWarningSchema]
    recommendations: List[RecommendationSchema]
    lifestyle_score: float
    metabolic_risk_count: int

class FeedbackRequestSchema(BaseModel):
    prediction_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    actual_outcome: Optional[str] = None
    comment: Optional[str] = None

class RetrainRequestSchema(BaseModel):
    token: str
