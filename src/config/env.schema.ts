import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().length(3),
  LOG_LEVEL: z.string(),
  WORKER_POOL_SIZE: z.coerce.number().int().positive(),
  MAX_CONCURRENT_JOBS: z.coerce.number().int().positive(),
  JOB_DEFAULT_TIMEOUT_MS: z.coerce.number().int().positive(),
  SHUTDOWN_GRACE_MS: z.coerce.number().int().positive(),
  LAB_ENABLED: z
      .enum(['true', 'false'])
      .default('true')
    .transform((val) => val === 'true'),
  ARTIFACTS_DIR: z.string(),
  BODY_LIMIT: z.coerce.number().int().positive().max(100),
  KEEP_ALIVE_TIMEOUT_MS: z.coerce.number().int().positive(),
  HEADERS_TIMEOUT_MS: z.coerce.number().int().positive()
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error(
      'Invalid env variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid env variables');
  }

  return parsed.data;
}
