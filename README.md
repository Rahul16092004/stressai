# 🧑‍💻 Early Prediction of Student Stress Using Behavioral Data with Explainable AI

## 📌 Overview

This project aims to **predict student stress levels in advance** using real-world behavioral data.
Unlike traditional approaches that detect stress after it occurs, this system focuses on **early prediction** and provides **explanations** for each prediction using Explainable AI.

---

## 🎯 Objectives

* Predict future stress levels (e.g., next-day stress)
* Use behavioral data instead of physiological sensors
* Provide interpretable results using Explainable AI
* Enable early intervention for student well-being

---

## 📊 Dataset

We use the StudentLife dataset, which contains real-world data collected from students via smartphones.

### Features include:

* 📱 Phone usage patterns
* 😴 Sleep data
* 🏃 Physical activity
* 📍 Location and mobility
* 📊 Self-reported stress levels

---

## ⚙️ Methodology

### 1. Data Preprocessing

* Handle missing values
* Normalize data
* Align time-based records

### 2. Time-Series Windowing

* Convert data into sequences
* Example: past 3 days → predict next day

### 3. Feature Engineering

* Sleep duration and trends
* Activity levels
* Phone usage patterns
* Behavioral changes over time

### 4. Model Training

Models used:

* Random Forest
* XGBoost
* (Optional) LSTM for time-series learning

### 5. Stress Prediction

* Predict stress levels: **Low / Medium / High**
* Focus on **future stress prediction**

### 6. Explainable AI

We use SHAP (SHapley Additive exPlanations) to interpret model predictions.

Example:

* Poor sleep → high contribution to stress
* Increased phone usage → moderate contribution

---

## 🧠 Technologies Used

* Python
* Pandas, NumPy
* Scikit-learn
* XGBoost
* SHAP (Explainable AI)

---

## 📈 Evaluation Metrics

* Accuracy
* Precision
* Recall
* F1-score

---

## 📊 Output

The system provides:

* Predicted stress level
* Explanation of contributing factors
* Early warning insights

---

## 🚀 Future Work

* Real-time stress monitoring system
* Mobile application integration
* Improved personalization for each student
* Multi-day stress prediction

---

## 📌 Key Contributions

* Early stress prediction (not just detection)
* Behavioral data-based approach
* Explainable AI for transparency

---

## 📂 Project Structure

```
/data
/notebooks
/src
   ├── preprocessing.py
   ├── feature_engineering.py
   ├── model.py
   ├── explainability.py
/app (optional dashboard)
```

---

## 📎 Conclusion

This project demonstrates how behavioral data combined with machine learning and explainable AI can be used to **predict and understand student stress**, enabling timely interventions.

---
