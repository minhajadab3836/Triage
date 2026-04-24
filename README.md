# Edge IQ Hackathon - RideGuard (TRIAGE)

RideGuard is an AI-powered crash detection and emergency dispatch system.

## Project Structure

- `backend/`: Fastify-based Node.js API for crash ingestion and ride management.
- `docs/`: Product Requirements Document (PRD), architecture diagrams, and system design notes.

## backend Setup

1. `cd backend`
2. `npm install`
3. `cp .env.example .env`
4. `docker-compose up -d`
5. `npm run dev`

## Features

- [x] Crash ingestion endpoint with BullMQ integration.
- [x] Ride session management.
- [x] Database schema for emergency triage.
- [x] Health check endpoint.
