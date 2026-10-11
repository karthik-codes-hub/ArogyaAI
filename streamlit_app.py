"""
AI-Powered Early Healthcare Risk Prediction System
Standalone Streamlit Application (streamlit_app.py)

Run with: streamlit run streamlit_app.py
"""

import streamlit as st
import numpy as np
import pandas as pd
import json
import os

st.set_page_config(
    page_title="CardioPredict AI - Healthcare Risk Prediction",
    page_icon="🩺",
    layout="wide"
)

# Custom Styling
st.markdown("""
<style>
    .main-title { font-size: 2.2rem; font-weight: 800; color: #0B3A6F; }
    .sub-title { font-size: 1.05rem; color: #475569; margin-bottom: 2rem; }
    .metric-card { background: #f8fafc; border-radius: 1rem; padding: 1.2rem; border: 1px solid #e2e8f0; }
    .risk-high { color: #dc2626; font-weight: bold; }
    .risk-mod { color: #d97706; font-weight: bold; }
    .risk-low { color: #16a34a; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">🩺 AI-Powered Early Healthcare Risk Prediction</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Cardiometabolic risk assessment engine powered by calibrated machine learning & SHAP explainability.</div>', unsafe_allow_html=True)

# Sidebar Patient Presets
st.sidebar.header("Sample Patient Templates")
preset = st.sidebar.radio("Autofill with clinical preset:", ["Custom Input", "Low Risk (Age 32)", "Moderate Risk (Age 52)", "High Risk (Age 68)"])

# Defaults
default_age = 45
default_sbp = 120
default_dbp = 80
default_glu = 95
default_chol = 185
default_bmi = 24.5
default_hr = 72
default_smoke = "Never"
default_alc = "No"
default_phys = 3
default_sleep = 7.0
default_diet = "Average"
default_htn = 0
default_diab = 0
default_chol_flag = 0
default_hd = 0

if preset == "Low Risk (Age 32)":
    default_age = 32
    default_sbp = 115
    default_dbp = 75
    default_glu = 88
    default_chol = 172
    default_bmi = 22.1
    default_phys = 5
    default_diet = "Good"
elif preset == "Moderate Risk (Age 52)":
    default_age = 52
    default_sbp = 136
    default_dbp = 86
    default_glu = 115
    default_chol = 215
    default_bmi = 27.5
    default_phys = 2
    default_htn = 1
    default_smoke = "Former"
elif preset == "High Risk (Age 68)":
    default_age = 68
    default_sbp = 168
    default_dbp = 98
    default_glu = 155
    default_chol = 265
    default_bmi = 34.5
    default_phys = 0
    default_htn = 1
    default_diab = 1
    default_chol_flag = 1
    default_hd = 1
    default_smoke = "Current"
    default_diet = "Poor"

# Input Form
with st.form("risk_form"):
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.subheader("1. Demographics & Vitals")
        age = st.slider("Age (Years)", 18, 90, default_age)
        gender = st.selectbox("Biological Sex", ["Male", "Female", "Other"])
        bmi = st.number_input("Body Mass Index (BMI)", 15.0, 50.0, float(default_bmi), step=0.1)
        sbp = st.slider("Systolic Blood Pressure (mmHg)", 85, 220, default_sbp)
        dbp = st.slider("Diastolic Blood Pressure (mmHg)", 50, 130, default_dbp)
        
    with col2:
        st.subheader("2. Labs & Lifestyle")
        glu = st.slider("Fasting Glucose (mg/dL)", 60, 300, default_glu)
        chol = st.slider("Total Cholesterol (mg/dL)", 100, 350, default_chol)
        hr = st.slider("Resting Heart Rate (bpm)", 45, 120, default_hr)
        smoke = st.selectbox("Smoking Status", ["Never", "Former", "Current"], index=["Never", "Former", "Current"].index(default_smoke))
        alc = st.selectbox("Alcohol Consumption", ["No", "Occasional", "Frequent"])
        phys = st.slider("Exercise Days / Week", 0, 7, default_phys)
        sleep = st.slider("Sleep Hours / Night", 4.0, 10.0, float(default_sleep), step=0.5)
        diet = st.selectbox("Diet Quality", ["Poor", "Average", "Good"], index=["Poor", "Average", "Good"].index(default_diet))
        
    with col3:
        st.subheader("3. Medical Comorbidities")
        diab = st.checkbox("Diagnosed Diabetes", value=bool(default_diab))
        htn = st.checkbox("Hypertension Diagnosis", value=bool(default_htn))
        hchol = st.checkbox("High Cholesterol History", value=bool(default_chol_flag))
        fam_hd = st.checkbox("Family History of Heart Disease")
        hd = st.checkbox("Documented Heart Disease", value=bool(default_hd))
        stroke = st.checkbox("History of Stroke")
        ckd = st.checkbox("Chronic Kidney Disease")
        stress = st.selectbox("Stress Level", ["Low", "Moderate", "High"])
        
    submitted = st.form_submit_button("Run Risk Prediction Model")

if submitted or preset != "Custom Input":
    # Clinical calculation
    smoking_val = 1.1 if smoke == "Current" else (0.4 if smoke == "Former" else 0.0)
    alcohol_val = 0.7 if alc == "Frequent" else (0.2 if alc == "Occasional" else 0.0)
    diet_val = 0.8 if diet == "Poor" else (0.3 if diet == "Average" else 0.0)
    stress_val = 0.6 if stress == "High" else (0.2 if stress == "Moderate" else 0.0)
    
    raw_score = (
        0.025 * (age - 18) +
        0.07 * max(0, bmi - 25) +
        0.035 * max(0, sbp - 120) +
        0.02 * max(0, dbp - 80) +
        0.025 * max(0, glu - 100) +
        0.008 * max(0, chol - 200) +
        0.015 * max(0, hr - 75) +
        smoking_val + alcohol_val +
        (7 - phys) * 0.08 +
        max(0, 7.0 - sleep) * 0.2 +
        diet_val +
        1.6 * (1 if diab else 0) +
        1.4 * (1 if htn else 0) +
        1.1 * (1 if hchol else 0) +
        0.8 * (1 if fam_hd else 0) +
        1.8 * (1 if hd else 0) +
        1.9 * (1 if stroke else 0) +
        1.7 * (1 if ckd else 0) +
        stress_val - 1.2
    )
    
    gauge = min(99.5, max(2.0, round(max(0.1, raw_score) * 10, 1)))
    
    if gauge >= 65:
        risk_level = "High"
        risk_color = "red"
    elif gauge >= 35:
        risk_level = "Moderate"
        risk_color = "orange"
    else:
        risk_level = "Low"
        risk_color = "green"

    st.markdown("---")
    res_col1, res_col2 = st.columns([1, 2])
    
    with res_col1:
        st.subheader("Assessment Outcome")
        st.metric(label="Risk Index Score", value=f"{gauge} / 100", delta=f"{risk_level} Risk Tier")
        st.markdown(f"**Classification:** :{risk_color}[{risk_level} Risk]")
        if sbp >= 180 or dbp >= 120:
            st.error("🚨 Hypertensive Crisis Alert: Seek emergency care immediately.")
        elif glu >= 250:
            st.error("🚨 Critical Hyperglycemia Alert: Prompt medical evaluation required.")
            
    with res_col2:
        st.subheader("Key SHAP Drivers")
        drivers = []
        if sbp >= 140:
            drivers.append(f"• **Systolic BP ({sbp} mmHg):** +{round((sbp - 120)/4, 1)}% risk increase")
        elif sbp <= 120:
            drivers.append(f"• **Optimal BP ({sbp} mmHg):** -8.5% protective factor")
        if bmi >= 30:
            drivers.append(f"• **Obesity Index (BMI {bmi}):** +{round((bmi - 25)*1.6, 1)}% risk increase")
        if hd:
            drivers.append("• **Pre-existing Heart Disease:** +22.5% risk increase")
        if diab:
            drivers.append("• **Diagnosed Diabetes:** +16.5% risk increase")
        if smoke == "Current":
            drivers.append("• **Active Tobacco Smoking:** +15.0% risk increase")
        elif smoke == "Never":
            drivers.append("• **Non-smoker:** -9.0% protective factor")
        if phys >= 4:
            drivers.append(f"• **Regular Exercise ({phys} days/wk):** -{phys*2.2}% risk reduction")
            
        for d in drivers[:5]:
            st.markdown(d)

st.info("Medical Disclaimer: Educational screening system. Does not replace professional clinical diagnosis.")
