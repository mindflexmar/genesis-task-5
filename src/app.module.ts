import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './services/subscription.service';
import { WeatherService } from './services/weather.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { NewMailerService } from './services/mailer-service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
      }),
    }),
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
  providers: [SubscriptionService, WeatherService, NewMailerService],
})
export class AppModule {}
