import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { UrlController } from '../controllers/url.controller';
import { AppService } from '../services/app.service';
import { UrlService } from '../services/url.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '../entities/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'andriopostgres',
      database: 'urlshortenerdb',
      entities: [Url],
      synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Url])
    ],
  controllers: [AppController, UrlController],
  providers: [AppService, UrlService],
})
export class AppModule{}
