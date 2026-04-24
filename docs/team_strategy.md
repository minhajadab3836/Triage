
# 🚀 OVERALL STRATEGY (IMPORTANT)

### 🎯 Goal:

Build a **working demo** that:

* Detects a “crash” (simulated or real sensor)
* Runs rule-based + basic AI validation
* Sends alert to backend
* Displays alert on dashboard (hospital/police UI)

👉 **Don’t overbuild AI. Fake/simulate where needed.**
👉 **End-to-end flow > perfect components**

---

# 👥 TEAM SPLIT (3 PEOPLE)

### 👨‍💻 Person 1 — Mobile App + Sensors

* Sensor data (accelerometer, GPS)
* Rule-based crash detection
* Trigger alert
* Send data to backend

---

### 👨‍💻 Person 2 — Backend + AI Engine

* API server
* Alert processing
* Fake/Light AI logic
* Data storage
* Routing to dashboard

---

### 👨‍💻 Person 3 — Frontend Dashboard

* UI for hospital/police
* Real-time alert display
* Map + data visualization

---

# ⏱️ 21-HOUR TIMELINE (STRICT EXECUTION)

## 🕐 PHASE 1: Setup & Planning (0–2 hrs)

**All together:**

* Finalize tech stack:

  * Mobile: React Native / Flutter (or even Android native)
  * Backend: Node.js (Express) / FastAPI
  * Frontend: React + Tailwind
  * DB: Firebase / MongoDB (or skip DB initially)

**Tasks:**

* Define API contract (VERY IMPORTANT)
* Define alert JSON format:

```json
{
  "userId": "123",
  "location": { "lat": 0, "lng": 0 },
  "impactScore": 85,
  "time": "timestamp",
  "bloodGroup": "B+"
}
```

---

## 🕐 PHASE 2: Core Development (2–10 hrs)

### 👨‍💻 Person 1 (Mobile)

**Tasks:**

* Get accelerometer + GPS
* Create crash detection logic:

```pseudo
if acceleration > threshold:
    trigger alert
```

* Add manual “Simulate Crash” button (VERY IMPORTANT for demo)
* Send POST request to backend

---

### 👨‍💻 Person 2 (Backend + AI)

**Tasks:**

* Create API:

  * `POST /alert`
  * `GET /alerts`

* Rule-based validation:

```pseudo
if impactScore > threshold:
    alert = true
```

* “AI Engine” (keep it simple):

```pseudo
if impactScore > 80:
    severity = "HIGH"
else:
    severity = "LOW"
```

* Add:

  * Fake Real/Fake alert classification
  * Impact score calculation (or accept from app)

* Store in memory (no DB if short on time)

---

### 👨‍💻 Person 3 (Frontend Dashboard)

**Tasks:**

* Build UI:

  * Alert list
  * Alert details
* Show:

  * Location
  * Impact score
  * Time
* Add map (optional but powerful):

  * Use Leaflet / Google Maps

---

## 🕐 PHASE 3: Integration (10–15 hrs)

**All members sync**

### Tasks:

* Connect mobile → backend
* Connect backend → frontend
* Test full flow:

  * Simulate crash
  * Alert appears on dashboard

---

## 🕐 PHASE 4: Polish & Smart Features (15–18 hrs)

### Add these (high impact, low effort):

* 🟢 Loading states
* 🟢 Alert severity color:

  * Red = High
  * Yellow = Medium
* 🟢 Sound/notification on dashboard
* 🟢 Auto-refresh dashboard (polling)

---

## 🕐 PHASE 5: Demo Optimization (18–21 hrs)

This is where you win the hackathon.

### 🎯 Focus:

* Smooth demo flow
* No crashes
* Clear storytelling

### Tasks:

* Add **“Demo Mode” button**
* Pre-fill:

  * Fake user data
  * Blood group
* Ensure:

  * 100% success rate of demo

---

# ⚡ FINAL DEMO FLOW (IMPORTANT)

1. Open mobile app
2. Click **“Simulate Crash”**
3. Backend receives alert
4. AI marks severity
5. Dashboard shows:

   * Location 📍
   * Impact Score 💥
   * Status 🚨
6. Say:

   > “Alert sent to nearest hospital/police”

---

# 🧠 SMART SHORTCUTS (DO THIS)

* ❌ Don’t build real AI → simulate it

* ❌ Don’t build real hospital integration → just display UI

* ❌ Don’t overcomplicate sensors

* ✅ Focus on:

  * Flow
  * UI clarity
  * Real-world impact

---

# 🔥 BONUS (if time permits)

* Add:

  * Emergency contact notification (mock)
  * Voice alert
  * Helmet sensor as “future scope”

---

# 📌 FINAL CHECKLIST

### MUST HAVE:

* [ ] Crash detection (or simulation)
* [ ] API working
* [ ] Dashboard receiving alerts
* [ ] Impact score + severity
* [ ] Clean UI

### NICE TO HAVE:

* [ ] Map
* [ ] Sound alert
* [ ] Fake AI logic

---

# 🧠 FINAL ADVICE

This is not a coding contest — it’s a **product thinking contest**.

If judges see:

* Clear flow ✅
* Real-world problem ✅
* Clean execution ✅

You’re already ahead.

---


