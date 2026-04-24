import { FastifyInstance } from 'fastify';
import { Queue } from 'bullmq';
import crypto from 'crypto';

// Setup crash processing queue. Assumes redis is running on localhost:6379 natively.
const crashQueue = new Queue('CrashProcessing', {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
});

export default async function (server: FastifyInstance) {
  
  // Crash ingestion endpoint (Target: < 200ms)
  server.post('/', async (request, reply) => {
    const body = request.body as any;
    
    // 1. Client idempotency key to prevent duplicates
    const clientUuid = body.client_uuid || crypto.randomUUID();
    
    // 2. Validate payload (session_id, gps_location, raw_sensor_snapshot)
    if (!body.session_id || !body.raw_sensor_snapshot) {
      return reply.status(400).send({ error: 'Missing required payload fields' });
    }

    // 3. TODO: Write crash_events row with status 'processing' in Postgres

    // 4. Push to Async Queue for AI scoring and web dispatch
    const crashEventId = crypto.randomUUID(); // Mock DB ID
    
    await crashQueue.add('ProcessCrash', {
      crashEventId,
      sessionId: body.session_id,
      clientUuid,
      gpsLocation: body.gps_location,
      sensorSnapshot: body.raw_sensor_snapshot,
    });

    // 5. Respond immediately
    return reply.status(202).send({ 
      success: true, 
      message: 'Crash event accepted for processing',
      crashEventId,
      queued: true 
    });
  });

}
