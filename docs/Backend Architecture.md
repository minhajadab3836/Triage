
Here's the full backend technical breakdown, split into the major areas you need to design. I'll go diagram by diagram.

**First: the overall backend architecture** — what services exist and how they talk to each other.
![[backend_architecture_overview.svg|697]]

Now the most critical flow — what happens the moment a crash is detected. This is time-sensitive, so the design here matters a lot.
![[crash_detection_app_plan 1.svg|697]]

Now the database schema — what tables you need and how they relate.---

![[database_schema_erd.html]]

#### Now the full technical breakdown in prose:

**Technology stack recommendations**

For the API, use Node.js with Express or Fastify (fast, easy to hire for, great async support) or Python with FastAPI (better if your AI team is already in Python). Your database is PostgreSQL as the primary store — it handles the relational data well and has a `point` type for GPS coordinates natively. For time-series sensor data (if you want to store the full ride sensor stream, not just crash snapshots), add InfluxDB or TimescaleDB. For the message queue, use Redis with BullMQ — it's simpler to operate than RabbitMQ and sufficient for your workload.

**API endpoints you need to build**

The mobile app needs these routes:

`POST /auth/register` and `POST /auth/login` — returns a JWT. All other routes are JWT-protected.

`POST /rides/start` — creates a `ride_session` row, returns a `session_id` the phone holds for the duration of the ride.

`POST /rides/:id/end` — closes the session, marks status as `completed`.

`POST /rides/:id/sensor-stream` — optional endpoint to batch-upload sensor data periodically (every 10–30 seconds) during the ride. Useful for post-ride analytics and helps reconstruct what happened leading up to a crash.

`POST /crash` — the critical endpoint. Receives the crash payload: `session_id`, GPS coordinates, a raw sensor snapshot (accelerometer/gyro readings from the 5 seconds before and after impact), and device info. This endpoint must respond fast (acknowledge receipt under 200ms), then do all the heavy work asynchronously via the queue.

`GET /rides` — list of past rides for the history screen.

`PUT /profile/medical` — update blood group, medical history, emergency contact, allergies.

`GET /devices` — list paired devices stored for the user.

`POST /devices` — register a new hardware device (stores device type, Bluetooth MAC, firmware version).

**The crash processing pipeline in detail**

When `POST /crash` hits the server: (1) validate the JWT and session_id, (2) write a `crash_events` row immediately with status `processing`, (3) push a job onto the queue with the event ID, (4) return `202 Accepted` to the phone. The phone then starts its 30-second countdown UI — this response being fast is what gives the user a snappy experience.

The queue worker then: (1) calls the AI scoring service with the raw sensor snapshot — this can be a Python microservice wrapping your ML model, or a call to a hosted model endpoint, (2) in parallel, calls the Geo service to resolve the nearest hospital and police station from the GPS point, (3) once both return, updates the `impact_scores` table, then writes to `dispatch_logs` and fires the actual notifications.

**Geo service — finding the nearest hospital/police station**

Use the Google Places API (Nearby Search) or OpenStreetMap Overpass API. Query: `hospital` and `police` within a 10km radius of the crash GPS point, sorted by distance. Store the resolved targets in `dispatch_logs` so you have a permanent record of who was notified.

**Notification delivery to hospitals and police**

The hospital and police dashboards are web frontends (you mentioned "frontend of hospital & police station" in your diagram). The backend needs to push to them in real-time. Use WebSockets (Socket.io works well) or Server-Sent Events so their dashboards update the moment a crash is dispatched — no polling. On initial load, the dashboard fetches active incidents via REST; new ones arrive over the socket.

For additional redundancy, also send an SMS to a registered contact number at each station via Twilio or MSG91 — this ensures they're notified even if the dashboard tab is closed.

**Security and data sensitivity**

Medical history and blood group are sensitive personal health data. Encrypt the `medical_profiles` table at rest using PostgreSQL's `pgcrypto` extension — encrypt those fields at the application layer before writing, not just at the disk level. Use HTTPS everywhere. The `dispatch_logs` table is your audit trail — never delete it. For the hospital/police dashboards, use separate JWT roles so they can only read incidents assigned to their institution, not everyone's data.

**Offline resilience on the phone side**

If the phone has no connectivity at crash time, the app must queue the crash payload locally (SQLite on the device) and retry with exponential backoff when connectivity returns. The backend `POST /crash` endpoint should be idempotent — use the `crash_event_id` generated on the phone as a client-generated UUID so retrying the same event doesn't create duplicate rows (use `INSERT ... ON CONFLICT DO NOTHING`).

**Infrastructure to deploy this on**

For an early-stage MVP, a single VPS (DigitalOcean Droplet or AWS EC2 t3.medium) running Docker Compose with your API, PostgreSQL, and Redis is perfectly fine. As you scale: put the API behind a load balancer, move PostgreSQL to a managed service (AWS RDS or Supabase), and move Redis to a managed Redis (ElastiCache or Upstash). The AI scoring service should be its own container from the start since it will have different resource needs (GPU if you go that route).
