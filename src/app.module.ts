import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './services/subscription.service';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Subscription],
        synchronize: false,
        migrations: [__dirname + '/db/migrations/*.{ts,js}'],
        migrationsRun: true,
        cli: {
          migrationDir: 'src/db/migrations',
        }
      }),
    inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Subscription])
  ],
  controllers: [AppController],
  providers: [AppService, SubscriptionService, WeatherService],
})
export class AppModule {}
