import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { RootMiddleware } from './common/middleware/root.middleware';
import { AuthorsModule } from './authors/authors.module';
import { PostsModule } from './posts/posts.module';

// 依存関係を解決する。
// controllerにただserviceをDIするだけではダメで、moduleに依存関係を記述して初めてDIが完成する。
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      include: [AuthorsModule],
      driver: ApolloDriver,
      debug: false,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    }),
    CatsModule,
    AuthorsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RootMiddleware).forRoutes(AppController);
  }
}
