import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import crashRoutes from './routes/crash';
import ridesRoutes from './routes/rides';

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: true, // For MVP
});


server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

server.register(crashRoutes, { prefix: '/api/v1/crash' });
server.register(ridesRoutes, { prefix: '/api/v1/rides' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
