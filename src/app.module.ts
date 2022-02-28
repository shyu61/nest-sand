import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { RootMiddleware } from './common/middleware/root.middleware';

// 依存関係を解決する。
// controllerにただserviceをDIするだけではダメで、moduleに依存関係を記述して初めてDIが完成する。
@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RootMiddleware).forRoutes(AppController);
  }
}
