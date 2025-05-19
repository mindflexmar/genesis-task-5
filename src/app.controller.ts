import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './services/subscription.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject(SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('subscribe')
  public async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<{ success: boolean }> {
    return this.subscriptionService.subscribe(createSubscriptionDto);
  }
}
