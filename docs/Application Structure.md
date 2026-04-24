
Now I have a full picture. Let me create a well-structured application plan.Here's the full structured plan broken into four layers:

![[crash_detection_app_plan.svg|642]]

**App screens (bottom nav)**

The app has four main sections: Home, Devices, Ride History, and Profile. The Home screen is the primary one — it has a prominent "Start Ride" button that activates all the pipelines in the background, and a "Finish Ride" button to end the session. The Devices screen is where users see all connected hardware (phone sensors by default, Bluetooth helmet sensors optionally), their status, battery level, and data quality signal. Ride History shows past sessions and any crash events. Profile stores the user's blood group, medical history, and emergency contacts — this is the data that gets dispatched to hospitals.

**Data pipeline (what runs during a ride)**

1. Sensor input — phone's accelerometer, gyroscope, and GPS are always active. If a helmet device is paired over Bluetooth, its data merges in here as higher-fidelity input.
2. Application layer — buffers and pre-processes the raw sensor stream.
3. Rule-based crash detection — a fast threshold check (e.g. sudden G-force spike) that triggers an alert so the system reacts immediately without waiting for AI inference.
4. AI engine — validates whether the alert is real or a false positive, then computes two sub-scores: physical severity (impact force, body movement patterns) and mental state estimate (post-impact sensor behavior). These combine into a 0–100 impact score.
5. Backend API — on a confirmed crash, dispatches the full payload (location, time, impact score, blood group, medical history) to the nearest hospital and police station dashboards.

**Devices panel design**

This panel should have three sub-sections: a paired device list (all connected hardware), a Bluetooth scanner to add new devices, and a per-device status card showing signal strength, battery, and data quality. The key insight is that phone sensors work as a baseline, but helmet hardware — which is physically closer to the point of impact and can carry more sensors — gives the AI engine significantly better data to work with.

**Key technical decisions to plan for**

Background service — the ride session needs to run as a persistent background service so the app keeps collecting data even when the screen is off. Confirmation window — after a crash trigger, give the user a 15–30 second countdown to cancel a false alarm before dispatching, with a loud alert tone. Offline resilience — the impact data and payload should be queued locally and retried if there's no connectivity at the crash site.

