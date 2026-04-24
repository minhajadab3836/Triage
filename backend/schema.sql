CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  fcm_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blood_group VARCHAR(255) NOT NULL, -- Encrypted at app layer
  medical_history TEXT,            -- Encrypted at app layer
  allergies TEXT,                  -- Encrypted at app layer
  emergency_contact VARCHAR(255),  -- Encrypted at app layer
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ride_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, crash_pending
  device_manifest JSONB
);

CREATE TABLE IF NOT EXISTS crash_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES ride_sessions(id) ON DELETE CASCADE,
  client_uuid UUID UNIQUE, -- Client-generated ID for idempotency
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  gps_location JSONB, -- Storing lat/lng as JSONB for simplicity
  raw_sensor_snapshot JSONB,
  status VARCHAR(20) DEFAULT 'processing', -- processing, dispatched, cancelled
  false_alarm BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS impact_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crash_event_id UUID REFERENCES crash_events(id) ON DELETE CASCADE,
  physical_score INTEGER,
  mental_score INTEGER,
  total_score INTEGER,
  confidence VARCHAR(20),
  model_version VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS dispatch_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crash_event_id UUID REFERENCES crash_events(id),
  recipient_type VARCHAR(50), -- hospital, police
  recipient_id VARCHAR(50),
  delivery_status VARCHAR(20),
  dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at TIMESTAMP
);
