import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './services/subscription.service';
import { WeatherService } from './services/weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';

@Controller()
export class AppController {
  constructor(
    @Inject(SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(WeatherService)
    private readonly weatherService: WeatherService,
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
}
