import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = Number(process.env.PORT)
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
        .setTitle('Nest Blog API')
        .setDescription('Documentation REST API')
        .setVersion('1.0.0')
        .addTag('Maks')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)

  await app.listen(PORT)
}
bootstrap();
