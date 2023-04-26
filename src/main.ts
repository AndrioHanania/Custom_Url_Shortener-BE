import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  });
  buildApiDescription(app);

  await app.listen(3001, () => console.log("server on port 3001..."));
}
bootstrap();

///////////////////////////////////////////////////////////////////////////

async function buildApiDescription(app: INestApplication)
{
  //We can see the API description in 'http://localhost:3001/api#/'
  const options = new DocumentBuilder()
  .setTitle('API TO "CUSTOM_URL_SHORTENER" APP')
  .setDescription( 'API description')
  .setVersion( '2.0 ')
  .addTag('UrlController', 'url logic end points')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
