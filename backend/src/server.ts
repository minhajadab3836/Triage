import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: true, // For MVP
});

import crashRoutes from './routes/crash';
import ridesRoutes from './routes/rides';

server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

server.register(crashRoutes, { prefix: '/api/v1/crash' });
server.register(ridesRoutes, { prefix: '/api/v1/rides' });

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
