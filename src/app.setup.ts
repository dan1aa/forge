import { INestApplication, RequestMethod, VersioningType } from '@nestjs/common';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health/live', method: RequestMethod.GET }],
  });
  app.enableVersioning({ type: VersioningType.URI });
}
