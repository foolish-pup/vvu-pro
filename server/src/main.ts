/*
 * @Author: 狗蛋<pup.com>
 * @Date: 2024-07-09 15:26:41
 * @LastEditors: 狗蛋<pup.com>
 * @LastEditTime: 2024-10-09 10:44:10
 * @Description: 全局入口文件
 */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';
import { AllExceptionsFilter } from '@/filter/all-exception.filter';
import { requestMiddleware } from '@/middleware/request.middleware';
import { ValidationPipe } from '@/pipe/validation.pipe';
import { AppModule } from './app.module';

declare const module: any;

async function configureSwagger(app: NestExpressApplication) {
  const configService: ConfigService = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE') || 'API Documentation')
    .setDescription(configService.get('SWAGGER_DESCRIPTION') || 'API Description')
    .setVersion(configService.get('SWAGGER_VERSION') || '1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('SWAGGER_PATH') || 'docs', app, document);

  // 仅在开发环境暴露 swagger.json
  if (configService.get('NODE_ENV') === 'development') {
    app.getHttpAdapter().get('/swagger.json', (req: express.Request, res: express.Response) => {
      res.json(document);
    });
  }
}

async function configureSession(app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
      },
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  const isProduction = configService.get('NODE_ENV') === 'production';

  // 安全中间件
  if (isProduction) {
    app.use(helmet());
    app.use(compression());
  }
  
  // CORS 配置
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 请求体解析
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 日志配置
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 代理配置
  app.set('trust proxy', configService.get('TRUST_PROXY') || 1);

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局参数验证
  app.useGlobalPipes(new ValidationPipe());

  // 全局请求拦截中间件
  app.use(requestMiddleware);

  // Session 配置
  await configureSession(app);

  // Swagger 配置
  if (!isProduction) {
    await configureSwagger(app);
  }

  // 静态文件服务
  const rootDir = join(__dirname, '..');
  app.use(
    '/static',
    express.static(join(rootDir, 'upload'), {
      maxAge: isProduction ? '7d' : 0,
    }),
  );

  // 热重载（仅开发环境）
  if (module.hot && !isProduction) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // 健康检查端点
  app.getHttpAdapter().get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({ code: 200 });
  });

  const host = configService.get<string>('HOST') || '0.0.0.0';
  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();