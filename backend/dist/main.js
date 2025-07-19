"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const compression = require("compression");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./common/logger/winston.config");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const winstonLogger = (0, winston_config_1.createWinstonLogger)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger(winstonLogger),
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    const environment = configService.get('NODE_ENV', 'development');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3001'),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.setGlobalPrefix('api/v1');
    if (environment !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('ChainSure API')
            .setDescription('Community-governed mutual insurance platform API')
            .setVersion('1.0')
            .addTag('authentication', 'User authentication and authorization')
            .addTag('policies', 'Insurance policy management')
            .addTag('claims', 'Claim submission and processing')
            .addTag('governance', 'Community governance and voting')
            .addTag('blockchain', 'Blockchain interaction utilities')
            .addTag('ai', 'AI-powered analysis and fraud detection')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
        });
        logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
    }
    await app.listen(port);
    logger.log(`🚀 ChainSure Backend running on port ${port}`);
    logger.log(`🌍 Environment: ${environment}`);
    logger.log(`🔗 Health check: http://localhost:${port}/api/v1/health`);
    if (environment !== 'production') {
        logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
    }
}
bootstrap().catch((error) => {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map