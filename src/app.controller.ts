import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './services/subscription.service';
import { WeatherService } from './services/weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { Frequency } from './enums/frequency.enum';
import { NewMailerService } from './services/mailer-service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(
    @Inject(SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(WeatherService)
    private readonly weatherService: WeatherService,
    @Inject(NewMailerService)
    private readonly mailerService: NewMailerService,
  ) {}

  @Get('weather')
  public async getWeather(@Query() getWeatherDto: GetWeatherDto): Promise<{ temperature: number; humidity: number; description: string }> {
    return this.weatherService.getWeatherByCity(getWeatherDto.city);
  }

  @Get('confirm/:token')
  public async confirmSubscription(@Query('token') token: string): Promise<{ success: boolean }> {
    return this.subscriptionService.confirmSubscription(token);
  }

  @Get('unsubscribe/:token')
  public async unsubscribe(@Query('token') token: string): Promise<{ success: boolean }> {
    return this.subscriptionService.unsubscribe(token);
  }

  @Post('subscribe')
  public async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<{ success: boolean }> {
    return this.subscriptionService.subscribe(createSubscriptionDto);
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async sendHourlyWeatherUpdates(): Promise<void> {
    const subscriptions = await this.subscriptionService.getAllSubscribers(Frequency.HOURLY);
    for (const subscription of subscriptions) {
      const weather = await this.weatherService.getWeatherByCity(subscription.city);
      await this.mailerService.sendEmail(subscription.email,
        'Hourly Weather Update',
        `The current weather in ${subscription.city} is ${weather.description} with a temperature of ${weather.temperature}°C and humidity of ${weather.humidity}%.`
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  public async sendDailyWeatherUpdates(): Promise<void> {
    const subscriptions = await this.subscriptionService.getAllSubscribers(Frequency.DAILY);
    for (const subscription of subscriptions) {
      const weather = await this.weatherService.getWeatherByCity(subscription.city);
      await this.mailerService.sendEmail(subscription.email,
        'Daily Weather Update',
        `The current weather in ${subscription.city} is ${weather.description} with a temperature of ${weather.temperature}°C and humidity of ${weather.humidity}%.`
      );
    }
  }
}
