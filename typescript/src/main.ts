import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { healthz } from './common/middleware/healthz.middleware';
import { MicroserviceOptions } from "@nestjs/microservices";
import { grpcClientOptions } from "./grpc-client-options";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);

  app.use(logger);
  app.use(healthz);
  await app.listen(3000);
}
bootstrap();
