import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
}));

export const httpConfig = registerAs('http', () => ({
  body_limit: process.env.BODY_LIMIT,
  keep_alive_timeout_ms: process.env.KEEP_ALIVE_TIMEOUT_MS,
  headers_timeout_ms: process.env.HEADERS_TIMEOUT_MS
}));

export const jobConfig = registerAs('job', () => ({
  max_concurrent_jobs: process.env.MAX_CONCURRENT_JOBS,
  job_default_timeout_ms: process.env.JOB_DEFAULT_TIMEOUT_MS,
}));

export const workerConfig = registerAs('worker', () => ({
  workder_pool_size: process.env.WORKER_POOL_SIZE,
}));

export const shutdownConfig = registerAs('shutdown', () => ({
  shutdown_grace_ms: process.env.SHUTDOWN_GRACE_MS,
}));

export const labConfig = registerAs('lab', () => ({
  lab_enabled: process.env.LAB_ENABLED,
}));

export const artifactsConfig = registerAs('artifacts', () => ({
  artifacts_dir: process.env.ARTIFACTS_DIR,
  artifacts_til_ms: process.env.ARTIFACT_TTL_MS,
}));
